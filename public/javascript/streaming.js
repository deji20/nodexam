const mediaSource = new MediaSource();
let sourceBuffer; 
const playlist = [];

mediaSource.addEventListener('sourceopen', () => {
    let videoPlayer = $("videoPlayer");
    videoPlayer.on("")

    sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.640028, mp4a.40.2');
    sourceBuffer.mode = "sequence";

    let arrayOfBlobs = [];
    sourceBuffer.addEventListener("updateend",() => {
        if (mediaSource.readyState === "open" && sourceBuffer && sourceBuffer.updating === false ){
            let chunk = arrayOfBlobs.shift();
            if(chunk){
                let img = $(`thumbnail ${chunk.id}`);
                sourceBuffer.appendBuffer(chunk.video);
                window.setTimeout = () => toggleFocusThumbnail(img), sourceBuffer.buffered.end(0);
            }
        }
    })
    
    let socket = io("/toosec");
    socket.emit("nextVid")

    //tracks the video playing and how much is buffered ahead of time;
    $("#videoPlayer").on("timeupdate", (event) => {
        totalDuration = playlist.reduce((accumulater, current) => accumulater + current.duration, 0);
        //requests a new video when queue is about to run out
        if(totalDuration - 0.5 < event.currentTarget.currentTime){
            socket.emit("nextVid");
        }
    })

    let queue = 0;
    socket.on("video", (data) => {
        playlist.push({duration: data.duration, id: data.id});
        if (mediaSource.readyState === "open" && sourceBuffer && sourceBuffer.updating === false ){
            sourceBuffer.appendBuffer(data.video);
            toggleFocusThumbnail($(".thumbnail")[queue++]);
        }else{
            arrayOfBlobs.push(data);
        }
    })

    socket.on("getBatch", (images) => {
        addThumbnails(images);
    })
})

$(document).ready(async () => {
    let player = $("#videoPlayer");
    player[0].crossOrigin = 'anonymous';
    player.attr("src", window.URL.createObjectURL(mediaSource));
})
