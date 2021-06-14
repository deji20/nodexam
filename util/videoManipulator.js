const stream = require("stream");
const {spawn} = require("child_process");
const { exception } = require("console");

const functions = {};

//transcodes the received videos into a standard fragmented mp4 format using ffmpeg
functions.transcoder = (inputBuffer, fragmentSize) => new Promise((resolve, reject) => {
    let inputStream = stream.Readable.from(inputBuffer);
    let outputBuffer = [];
    let child = spawn("ffmpeg", ["-f", "mp4","-i", "pipe:0", "-flags", "+global_header", "-frag_size", fragmentSize, "-movflags", "empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof", "-f", "mp4", "pipe:1"]);
    
    child.stdin.on("error", () => console.log("caught error"));
    inputStream.on("error", () => console.log("caught error"));
    
    child.stdout.on('data', (data) => outputBuffer.push(data));
    child.stdout.on("end", () => resolve(Buffer.concat(outputBuffer)));

    inputStream.pipe(child.stdin);
});

functions.getDuration = (inputBuffer) => new Promise((resolve, reject) => {
    let inputStream = stream.Readable.from(inputBuffer);
    let outputBuffer = [];
    let child = spawn("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "pipe:0"])

    child.stdin.on("error", () => console.log("caught error"));
    inputStream.on("error", () => console.log("caught error"));

    //stream event handlers
    child.on("error", (err) => reject(err));
    child.stdout.on('data', (data) => outputBuffer.push(data));
    child.stdout.on('end', () => resolve(Number.parseFloat(Buffer.concat(outputBuffer).toString())));
    inputStream.pipe(child.stdin);
})
functions.getDate = (inputBuffer) => new Promise((resolve, reject) => {
    let inputStream = stream.Readable.from(inputBuffer);
    let outputBuffer = [];
    const child = spawn("ffprobe", ["-v", "quiet", "pipe:0", "-print_format", "json", "-show_entries", "stream=index,codec_type:stream_tags=creation_time:format_tags=creation_time"]);

    child.stdin.on("error", () => console.log("caught error"));
    inputStream.on("error", () => console.log("caught error"));

    child.stdout.on('data', (data) => outputBuffer.push(data));
    child.stdout.on('end', () => resolve(JSON.parse(Buffer.concat(outputBuffer).toString()).format?.tags?.creation_time));
    inputStream.pipe(child.stdin);
})

functions.getThumbnail = (inputBuffer) => new Promise((resolve, reject) => {
    let inputStream = stream.Readable.from(inputBuffer);
    let outputBuffer = [];
    let child = spawn("ffmpeg", ["-f", "mp4", "-i","pipe:0", "-vframes", "1", "-f", "image2pipe", "pipe:1"])

    child.stdin.on("error", () => console.log("caught error"));
    inputStream.on("error", () => console.log("caught error"));

    //stream event handlers
    child.stdout.on('data', (data) => outputBuffer.push(data));
    child.stdout.on('end', () => resolve(Buffer.concat(outputBuffer)));
    inputStream.pipe(child.stdin);
}) 

module.exports = functions;