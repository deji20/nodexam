$("#uploadVid").on("change", async (e) => {
    let data = await toBinary(e.target.files[0]);
    let date = new Date()
    form = new FormData();
    console.log(e.target.files);
    form.append("data", e.target.files[0]);
    form.append("date", date);

    try{
        let response = await fetch("/projects/toosec/api/videos", {
            method: 'POST',
            body: form
        })
        alert("success")
        console.log(response);
    }catch(exception){
        alert("failed");
        console.log(exception);
    }
});