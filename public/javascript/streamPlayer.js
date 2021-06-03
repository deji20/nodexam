class StreamPlayer extends EventTarget{
    constructor(videoPlayer){
        super();
        this.mediaSource = new MediaSource();
        this.playlist = [];
        this.arrayOfBlobs = [];
        
        this.videoPlayer = $(videoPlayer);
        this.videoPlayer.attr("src", window.URL.createObjectURL(this.mediaSource));

        this.mediaSource.addEventListener('sourceopen', () => {
            this.sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.640028, mp4a.40.2');
            this.sourceBuffer.mode = "sequence";
        
            //runs when source buffer has finished appending the last video
            //adds any queued videos to the sourcebuffer 
            this.sourceBuffer.addEventListener("updateend",() => {
                if (this.arrayOfBlobs.length && this.mediaSource.readyState === "open" && this.sourceBuffer && this.sourceBuffer.updating === false ){
                    let chunk = arrayOfBlobs.shift();
                    this.sourceBuffer.appendBuffer(chunk.video);
                }
            });
            this.dispatchEvent(new Event("ready"))
        })
        //tracks the video playing and how much is buffered ahead of time;
        this.videoPlayer.on("timeupdate", (event) => {
            //sends event when video buffer is running out
            this.playlist.reduce((accumulater, current) => accumulater + current.duration, 0) - 0.5 < event.currentTarget.currentTime && this.dispatchEvent(new Event("runningout"))
        });
    }

    //adds video immediately if possible else pushes video to queue
    addVideo(video){
        this.playlist.push({duration: video.duration, id: video.id});
        if (this.mediaSource.readyState === "open" && this.sourceBuffer && this.sourceBuffer.updating === false ){
            this.sourceBuffer.appendBuffer(video.video);
        }else{
            this.arrayOfBlobs.push(video);
        }
    }
}