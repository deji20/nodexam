const express = require("express");
const router = express.Router();
const upload = require("multer")();

const videoHandler = require("../util/videoManipulator");
const videoModel = require("../models/videoModel");
const videoRepo = require("../repositories/videoRepository");
const { getBatch } = require("../repositories/videoRepository");

const FRAGMENT_SIZE = 2000;

router.get("/:id", async (req, res) => {
    res.send({videos:await videoRepo.getById(req.params.id)});
});

router.get("/", async (req, res) => {
    if(req.query.amount){
        res.send({videos: await videoRepo.getBatch(req.query.amount, req.query.offset)});
    } 
    res.send({videos: await videoRepo.getAll({})})
});


router.post("/", upload.single("data"), async (req, res) => {
    try{
        let videoData = await videoHandler.transcoder(req.file.buffer, FRAGMENT_SIZE);
        console.log("video Created");
        let duration  = await videoHandler.getDuration(req.file.buffer);
        console.log("duration logged", duration.toString());
        let thumbnail = await videoHandler.getThumbnail(req.file.buffer);
        console.log("thumbnail created");
        let date = req.body.date;
        videoRepo.create(new videoModel(date, duration, videoData, thumbnail));
        res.status(200).send();
    }catch(exception){
        console.log(exception);
        res.status(400).send(exception);
    }
});

router.get("/:id/stream", (req, res) => {
    videoRepo.getStream(req.params.id);
    res.status(200).send();
})

router.patch("/:id", (req, res) => {
    videoRepo.update()
});

router.delete("/:id", async (req, res) => {
    await videoRepo.delete(req.params.id);
    res.status(200).send();
});

module.exports = router;