const videoRepo = require("./repositories/videoRepository");
const socketIO = require("socket.io");

//creates a new socket.io instance if one does not already exist,
module.exports = (server) => {
    io = socketIO(server);


    const tooSec = io.of("/toosec");
    tooSec.on("connection", async (socket) => {
        let amount = 1;
        let offset = -amount;
        socket.on("nextVid", async (videoIndex) => {
            offset = videoIndex ?? (offset += amount);
            console.log(offset);
            let videos;
        
            !videos && (videos = await videoRepo.getBatch(amount, offset));
            if(!videos.length){
                offset = 0;
                videos = await videoRepo.getBatch(amount, offset);
            }
    
            let vid;
            videos.length && (vid = videos.shift());
            vid && socket.emit("video", {video: vid.videoData.buffer, id: vid._id.toHexString(), duration: vid.duration});
        })
        async function getBatch(){
            socket.emit("getBatch", (await videoRepo.getBatch(10, 0)).map((vid) => {
                return {thumbnail: vid.thumbnail.buffer, id: vid._id.toHexString()}; 
            }));   
        }
        getBatch();
    })    
}