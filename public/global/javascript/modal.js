function toggleModal(element){
    if(element){
        addToModal(element);
    }
    let screen = $("#modalScreen");
    console.log(screen[0]);
    screen.fadeToggle(1000)
}

function addToModal(element){
    let content = $("#modalContent");
    console.log(element);
    content.empty();
    content.append(element);
}