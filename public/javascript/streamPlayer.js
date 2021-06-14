class StreamPlayer extends EventTarget{
    constructor(videoPlayer){
        super();
        this.mediaSource = new MediaSource();
        this.playlist = [];
        this.arrayOfBlobs = [];
        this.totalTime = 0;
        this.currentVideo;
        
        this.videoPlayer = $(videoPlayer).attr("src", window.URL.createObjectURL(this.mediaSource));

        this.mediaSource.addEventListener('sourceopen', () => {
            this.sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.640028, mp4a.40.2');
            this.sourceBuffer.mode = "sequence";
        
            //runs when source buffer has finished appending the last video
            //adds any queued videos to the sourcebuffer 
            this.sourceBuffer.addEventListener("updateend",() => {
                if (this.arrayOfBlobs.length && this.mediaSource.readyState === "open" && this.sourceBuffer && this.sourceBuffer.updating === false ){
                    let chunk = this.arrayOfBlobs.shift();
                    console.log(chunk)
                    try{
                        this.sourceBuffer.appendBuffer(chunk.video);
                    }catch(exception){
                        console.log(exception);
                    }
                }
            });
            this.dispatchEvent(new Event("ready"))
        })
        this.videoPlayer.on("waiting", () => {
            this.dispatchEvent(new Event("ended"))
        })
        //tracks the video playing and how much is buffered ahead of time;
        this.videoPlayer.on("timeupdate", (event) => {
            let currentTime = event.currentTarget.currentTime;
            let vid = this.playlist.find((video) => video.startTime < currentTime && video.endTime > currentTime);
            if(vid != this.currentVideo){
                this.currentVideo = vid;
                this.dispatchEvent(new Event("videoChanged"));
            } 
            //sends event when video buffer is running out
            this.totalTime - 1 < currentTime && this.dispatchEvent(new Event("runningOut"))
        });
    }

    //adds video immediately if possible else pushes video to queue
    addVideo(video){
        let startTime = this.totalTime
        let endTime = this.totalTime += video.duration;

        this.playlist.push({id: video.id, duration: video.duration, startTime:startTime, endTime:endTime, date:video.date});
        if (this.mediaSource.readyState === "open" && this.sourceBuffer && this.sourceBuffer.updating === false ){
            this.sourceBuffer.appendBuffer(video.data);
        }else{
            this.arrayOfBlobs.push(video);
        }
    }
}