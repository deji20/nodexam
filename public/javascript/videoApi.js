class VideoApi{
    constructor(){
        this.base = "/api/videos";
    }
    async create(form){
        try{
            let response = await fetch(`${this.base}`, {
                method: 'POST',
                body: form
            });
            return response;
        }catch(exception){
            throw exception;
        }
    }
    async getAll(){
        try{
            let result = await fetch(`${this.base}`);
            return result;
        }catch(exception){
            throw exception;
        }
    }
    async getById(id){
        try{
            let result = await fetch(`${this.base}/${id}`);
            return result;
        }catch(exception){
            throw exception;
        }
    };

    async delete(id){
        try{
            let result = await fetch(`${this.base}/${id}`, {
                method: 'DELETE'
            });
            console.log(result);
            return result;
        }catch(exception){
            console.log(exception);
            throw exception;
        }
    };

    async getStream(id){
        try{
            let result = await fetch(`${this.base}/${id}/stream`);
            return result;
        }catch(exception){
            throw exception;
        }
    }

    async getBatch(amount, offset = 0){
        try{
            let result = await fetch(`${this.base}/${id}?amount=${amount}&offset=${offset}`);
            return result;
        }catch(exception){
            throw exception;
        }
    }
    async getVideoDate(videoFile){
        let form = new FormData();
        form.append("video", videoFile)
        try{
            let result = await fetch(`${this.base}/date`, {
                method:"POST",
                body: form
            });
            return result;
        }catch(exception){
            throw exception;
        }
    }
}