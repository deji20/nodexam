let socket = io("/toosec");

socket.on("getBatch", (images) => addThumbnails(images));

$(document).ready(() => {
    streamPlayer.addEventListener("ready", () => {
        socket.emit("nextVid")
        //requests new video when buffer is nearing end
        streamPlayer.addEventListener("runningout", () => socket.emit("nextVid"));
        
        let queue = 0;
        socket.on("video", (data) => {
            streamPlayer.addVideo(data);
            toggleFocusThumbnail(queue++);
        });
    });
})