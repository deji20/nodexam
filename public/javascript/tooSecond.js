let streamPlayer;
let videoApi = new VideoApi(); 

//create and animate thumbnails
thumbnailIndex = 0;
function addThumbnails(elements){
    let referenceElement = $("#vidRef");
    let scrollElem = elements.map((element) => {
        let index = thumbnailIndex;
        let thumbnail = $("<div>", {
                "class":"cursor-pointer inline-block p-2"
            }).append(
                $("<img>", {
                    "class":"thumbnail transition-all inline shadow-2xl rounded-md duration-1000 h-44",
                    id: element.id,
                    value: element.id,
                    src:`data:image/png;base64,${toBase64(element.thumbnail)}`
                })
            ).on("click", (e) => {
                socket.emit("nextVid", index);
            });
        thumbnailIndex++
        return thumbnail;
    });
    referenceElement.before(scrollElem);
}

//manipulates the chosen thumbnail bringing focus on it 
let scrollWithFocus = true;
function toggleFocusThumbnail(videoInfo){
    let thumbnails = $(".thumbnail");
    let videoScroller = $("#videoScroller");
    let dateDisplay = $("#dateDisplay");
    //sets focus on the appropriate image
    let playing = $("#"+videoInfo.id);
    dateDisplay.text(new Date(videoInfo.date).toLocaleDateString());
    scrollWithFocus && videoScroller.animate({scrollLeft: (playing[0].offsetLeft - (videoScroller.width()/2 - playing.width()/2))});
    playing[0].offsetLeft + videoScroller.width() > $("#vidRef")[0].offsetLeft && socket.emit("getBatch");
    //resizes focused thumbnail
    thumbnails.removeClass("h-48 shadow-inner")
    playing.addClass("h-48 shadow-inner")
}

function toBase64(arr) {
    arr = new Uint8Array(arr);
    return btoa( arr.reduce((data, byte) => data + String.fromCharCode(byte), '') );
}

//jquery function that shakes any jquery object using css transform
$.fn.shake = function (speed) {
    this.each((index, element) => {
        if(!$(element).hasClass("shake")){
            $(element).addClass(`shake transition duration-${speed} transform`);
            let dir = true;
            let rotate;
            setInterval(() => {
                $(element).removeClass(rotate)
                rotate = dir ? "rotate-6" : "-rotate-6";
                $(element).addClass(rotate)
                dir = !dir;
            }, speed)
        }else{
            $(element).removeClass(`shake transition duration-${speed} transform`);
        }
    });
};

let socket = io("/toosec");
socket.on("getBatch", addThumbnails);

let queue = 0;
$(document).ready( async () => {
    streamPlayer = new StreamPlayer("#videoPlayer");

    $("#videoPlayer").on("click", (e) => {
        player = e.currentTarget;
        $(player).removeAttr("muted")
        player.volume = 0.6;
    })

    streamPlayer.addEventListener("ready", () => {
        socket.emit("getBatch");
        socket.emit("nextVid");
        let updating = false;
        //requests new video when buffer is nearing end
        streamPlayer.addEventListener("runningOut", () => {
            if(!updating){
                socket.emit("nextVid");
                updating = true;
            }
        });
    
        socket.on("video", (video) => {
            streamPlayer.addVideo(video)
            updating = false;
        });
        //streamPlayer.addEventListener("ended", () => {console.log("ended");socket.emit("nextVid")})
        streamPlayer.addEventListener("videoChanged", () => {
            toggleFocusThumbnail(streamPlayer.currentVideo);
        })
    });
})