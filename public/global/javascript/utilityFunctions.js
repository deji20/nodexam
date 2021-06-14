function* progressStates(element, size){
    let naturalState = element.contents();

    let success = $("<img>", {
            src: "/global/images/assets/check.png"
        })
        .css({
            "height": `${size*1.5}px`,
            "width": `${size*1.5}px`
        });
    let fail = $("<img>", {
            src:"/global/images/assets/fail.png"
        })
        .css({
            "height": `${size*1.5}px`,
            "width": `${size*1.5}px`
        });
    let loadingGif = $("<div>", {
            class:"animate-spin rounded-full"
        })       
        .css({
            "border": `${size/8}px solid #f3f3f3`,
            "border-top": `${size/8}px solid #3498db`,
            "border-bottom": `${size/8}px solid #3498db`,
            "height": `${size}px`,
            "width": `${size}px`
        })

    try{
        yield () => element.empty().append(loadingGif);
        yield () => {
            element.empty().append(success);
            setTimeout(() => element.empty().append(naturalState), 2000);
        }
    }catch(exception){
        yield () => {
            element.empty().append(fail);
            setTimeout(() => element.empty().append(naturalState), 2000);
        }
    }
}