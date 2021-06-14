const express = require("express");
const router = express.Router();
const upload = require("multer")();

const videoHandler = require("../util/videoManipulator");
const videoModel = require("../models/videoModel");
const videoRepo = require("../repositories/videoRepository");

const security = require("../security/securityMiddleware");

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

router.use("/", security);
router.post("/date", upload.single("video"), async (req, res) => {
    try{
        let date = await videoHandler.getDate(req.file.buffer);
        res.status(200).send(date.toString());
    }catch(exception){
        console.log(exception);
        res.status(400).send(exception);
    }
})

router.post("/", upload.single("data"), async (req, res) => {
    try{
        let videoData = await videoHandler.transcoder(req.file.buffer, FRAGMENT_SIZE);
        let duration  = await videoHandler.getDuration(req.file.buffer);
        let thumbnail = await videoHandler.getThumbnail(req.file.buffer);
        let date = req.body.date;

        videoRepo.create(new videoModel(date, duration, videoData, thumbnail));
        res.status(200).send();
    }catch(exception){
        console.log(exception);
        res.status(400).send(exception);
    }
})

router.delete("/:id", async (req, res) => {
    console.log(req.params.id);
    let dbResponse = await videoRepo.delete(req.params.id);
    console.log(dbResponse);
    res.status(200).send();
});

module.exports = router;