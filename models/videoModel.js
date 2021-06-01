class videoModel{
    constructor(date, duration, videoData, thumbnail){
        this.date = Date.parse(date);
        this.duration = duration;
        this.videoData = videoData;
        this.thumbnail = thumbnail;
    }
}

module.exports = videoModel;