let videoApi = new VideoApi(); 

$(document).ready(async () => {
    $("#videoPlayer").on("click", (e) => {
        player = e.currentTarget;
        $(player).removeAttr("muted")
        player.volume = 0.6;
    })
});

//create and animate thumbnails
function addThumbnails(elements){
    let scroller = $("#videoScroller");
    let scrollElem = elements.map((element) => $(`<div class="${element.id} thumbnail inline mx-2" onclick="toggleFocusThumbnail(this)"><img class="transition-all rounded-md shadow-2xl duration-500 h-44", src="data:image/png;base64,${toBase64(element.thumbnail)}"/></div>`))
    scroller.append(scrollElem);
}

function toggleFocusThumbnail(thumbnail){
    let image = $(thumbnail).children("img")

    if(image.hasClass("h-44")){
        image.removeClass("h-44").addClass("h-48");
    }else{
        image.removeClass("h-48").addClass("h-44");
    }
}

function toBase64(arr) {
    arr = new Uint8Array(arr);
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }
