$(document).ready(() => {
    $("#login").on("click", () => {
        toggleModal(createLoginForm());
    })
})

function createLoginForm(){
    let formContainer = $("<div>", {
        "class":"w-1/2 flex flex-col center"
    })

    let header = $("<div>", {
        "class":"grid grid-cols-3 w-full justify-center items-center bg-blue-900 bg-opacity-90 rounded-t-xl"
        })
        .append(
            $("<h1>", {
                "class":"inline col-start-2",
                text:"Login"
            }),
            $("<img>", {
                "class":"place-self-end h-10 bg-red-700 bg-opacity-90 rounded-tr-xl cursor-pointer",
                src:"/global/images/assets/close.png"
            }).on("click", () => toggleModal())
        );

    let username = $("<div>", {
            "class":"flex flex-col text-left mb-2"
        }).append(
            $("<label>", {
                    text:"Username"
                }),
            $("<input>", {
                "class":"text-black rounded p-1 text-sm font-sans",
                id:"username",
                type:"text",
                placeholder:"Username"
            })
        );

    let password = $("<div>", {
            "class":"flex flex-col text-left"
        }).append(
            $("<label>", {
                    text:"Password"
                }),
            $("<input>", {
                    "class":"text-black rounded p-1 text-sm font-sans",
                    id:"password",
                    type:"password", 
                    placeholder:"Password"
                })
            );

    let forms = $("<div>", {
        "class":"flex w-full px-10 flex-col py-5 bg-indigo-500 bg-opacity-80"
        })
        .append(username, password);
    
    let submit = $("<button>", {
        "class":"flex flex-1 w-full py-1 center bg-green-800 bg-opacity-90 rounded-b-xl",
        text:"Log In"
        })
        .on("click", async (event) => {
            let progress = progressStates($(event.target), 25);
            let user = { 
                username:$("#username").val(), 
                password:$("#password").val() 
            };
            try{
                progress.next().value();
                result = await fetch("/login", {
                    method:"POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify(user)
                });
                if(result.status === 403){
                    progress.throw().value();
                }else{
                    progress.next().value();
                    location.reload();
                }
            }catch(exception){
            }
        });

    formContainer.append(header, forms, submit);
    return formContainer;
}
