class VideoApi{
    constructor(){
        this.base = "/projects/toosec/api/videos";
    }
    async getAll(){
        try{
            let result = await fetch(`${this.base}`);
            return result;
        }catch(exception){
            console.log(exception);
        }
    }
    async getById(id){
        try{
            let result = await fetch(`${this.base}/${id}`);
            return result;
        }catch(exception){
            console.log(exception);
        }
    }
    async getStream(id){
        try{
            let result = await fetch(`${this.base}/${id}/stream`);
            console.log(result)
        }catch(exception){
            console.log(exception)
        }
    }

    async getBatch(amount, offset = 0){
        try{
            let result = await fetch(`${this.base}/${id}?amount=${amount}&offset=${offset}`);
            return result;
        }catch(exception){
            console.log(exception);
        }
    }
}