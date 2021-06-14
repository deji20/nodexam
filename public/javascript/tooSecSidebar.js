$("#showUpload").on("click", (event) => {
    toggleModal(createVideoUploadForm());
});

function createVideoUploadForm(){
    return $("<div>", {
        id:"uploadForm",
        "class":"flex flex-col w-1/2 text-black shadow-xl"
        }).append(
            $("<label>", {
                "class":"cursor-pointer grid grid-cols-3 justify-items-center items-center bg-blue-800 shadow-xl rounded-t-xl"
                }).on("mouseout", (event) => {
                    $("#uploadPic").attr("src", "/global/images/assets/video_file.png");
                }).on("mouseover", (event) => {
                    $("#uploadPic").attr("src", "/global/images/assets/add_file.png");
                }).append(
                    $("<img>", {
                        id:"uploadPic",
                        "class":"inline h-10 w-10 object-fill",
                        src:"/global/images/assets/video_file.png"
                    }),
                    $("<span>",{
                        id:"fileName",
                        "class":"text-white",
                        text:"Add File"
                    }),
                    $("<img>", {
                        "class":"place-self-end h-full bg-red-700 bg-opacity-90 rounded-tr-xl cursor-pointer",
                        src:"/global/images/assets/close.png"
                    }).on("click", (event) => {
                        event.preventDefault(); 
                        toggleModal()
                    }),
                    $("<input>", {
                        id:"newVideoFile",
                        "class":"hidden",
                        type:"file",
                        accept:"video/*"
                    }).on("change", (event) => {
                        $("#fileName").text($("#newVideoFile")[0].files[0].name);
                        $("#uploadForm").find("input, button").attr("disabled", false);
                    })
                ),
            $("<label>", {
                "class":"flex flex-grow h-10 flex-row",
                }).append(
                    $("<input>", {
                        id:"newVideoDate",
                        "class":"center flex flex-grow",
                        disabled:true,
                        type:"date"
                    }),
                    $("<button>", {
                        "class":"text-xs bg-blue-100 px-1 cursor-pointer text-white bg-indigo-400",
                        text:"Auto Date",
                        disabled:true,
                        type:"button"
                    }).on("click", autoDate)
                ),
            $("<label>", {
                "class":"rounded-b"
                }).append(
                    $("<button>", {
                        "class":"rounded-b-xl shadow-xl center w-full text-white bg-green-800 py-2 cursor-pointer",
                        text:"Upload Video"
                        })
                ).on("click", uploadVideo)
        )
}
async function uploadVideo(event){
    const videoFile = $("#newVideoFile")[0].files[0];
    const date = $("#newVideoDate").val();

    form = new FormData();
    form.append("data", videoFile);
    form.append("date", date);
    progress = progressStates($(event.target), 20)
    if(videoFile && date){
        try{
            progress.next().value();
            let response = await videoApi.create(form);
            progress.next().value();
            toggleModal();
        }catch(exception){
            progress.throw().value();
            console.log(exception);
        }
    }else{
        console.log(form);
    }
}

async function autoDate(event){
    const file = $("#newVideoFile")[0].files[0]
    const datePicker = $("#newVideoDate")
    progress = progressStates($(event.target), 20)
    progress.next().value();
    try{
        const response = await videoApi.getVideoDate(file);
        const textDate = await response.text()
        console.log(textDate);
        responseDate = new Date(textDate);
        datePicker.val(responseDate.toISOString().split('T')[0]);
        progress.next().value()
    }catch(exception){
        console.log(exception);
        progress.throw().value()
    }
}

let deleteMode = false;
$("#delete").on("click", () => {
    deleteMode = !deleteMode;
    const wrapper = $("#scrollWrapper");
    wrapper.addClass("bg-red-800");
    
    const thumbnails = $(".thumbnail");
    if(deleteMode){
        thumbnails
        .append($("<div>", {
            class:"absolute w-full h-full bg-blue-800"
        }))
        thumbnails.on("click", async (e) => {
            let id = $(e.currentTarget).attr("value");
            let response = await videoApi.delete(id);
            if(response.status === 200){
                e.currentTarget.remove();
            }
        }).shake(500);
    }else{
        wrapper.removeClass("bg-red-800");
        thumbnails.off("click").shake(500);
    }
})