const videoRepo = require("./repositories/videoRepository");
const socketIO = require("socket.io");

//creates a new socket.io instance if one does not already exist,
module.exports = (server) => {
    io = socketIO(server);

    const tooSec = io.of("/toosec");
    tooSec.on("connection", async (socket) => {
        let amount = 1;
    let offset = -amount;
    let batchAmount = 10;
    let batchOffset = 0;
    let videos;

    socket.on("nextVid", async (videoIndex) => {
        offset = videoIndex ?? (offset += amount);
        if(!videos || !videos.length) videos = await videoRepo.getBatch(amount, offset);
        if(videos && !videos.length){
            offset = 0;
            console.log("reset");
            videos = await videoRepo.getBatch(amount, offset);
        }
        let vid;
        videos.length && (vid = videos.shift());
        vid && socket.emit("video", {data: vid.videoData.buffer, id: vid._id.toHexString(), date:vid.date, duration: vid.duration});
    })
    socket.on("getBatch", getBatch)
    async function getBatch(){
        socket.emit("getBatch", (await videoRepo.getBatch(batchAmount, batchOffset)).map((vid) => {
            return {thumbnail: vid.thumbnail.buffer, id: vid._id.toHexString()};
        }));   
        batchOffset += batchAmount; 
    }
    })    
}