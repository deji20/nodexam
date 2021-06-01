const dbConnection = require(`../database/mongoDatabase`).client;
const {Duplex, Readable} = require("stream");

class videoRepository{
    constructor(){
        this.collection = dbConnection.db("tooSecond").collection("videos");
    }

    async create(video){
        let result = await this.collection.insertOne(video);
        return result.ops[0];
    }
    async delete(videoId){
        await this.collection.deleteOne({_id: videoId})
    }

    async update(video){
        return await this.collection.updateOne({_id:video._id}, video); 
    }

    async getBatch(amount, offset = 0, elements){
        return await this.collection.find(elements).limit(amount).skip(offset).sort({date:1}).toArray();
    }
    async getAll(elements){
        return await this.collection.find(elements).sort({date:1}).toArray();
    }
    async getById(videoId){
        return await this.collection.find({_id: videoId}).toArray();
    }
    async getStream(videoId){
        try{
            let stream = await this.collection.find({_id: videoId}).toArray();
            return stream[0].videoData.buffer;
        }catch(exp){
            throw exp
        }
    }
}


class RepoReader extends Readable{
    constructor(repo, startPosition, direction, options){
        super(options);
        this.x = this.y = this.z = 0;
        this.offset = startPosition;
        this.repo = repo;
        this.direction = direction;
        this.elements = [];

    }

    async changeBuffer(){
        if(this.elements.length && this.bufferPosition >= this.bufferSize){
            this.buffer = this.elements.shift().videoData.buffer;
            this.emit("videoChange", this.offset);
        }else if(!this.elements.length){
            let amount = 2;
            let newElements = await this.repo.getBatch(amount, this.offset)
            this.elements.push(...newElements);
            this.offset += amount;
            if(!newElements.length) {
                return null;
            }else{
                this.emit("nextBatch", newElements);
                this.buffer = this.elements.shift().videoData.buffer;
            }
        }
        this.bufferSize = this.buffer.length;
        this.bufferPosition = 0;
        return true;
    }

    _read(chunkSize){
        let chunk = this.getChunk(chunkSize);
        if(chunk && chunk.length){
            this.push(chunk);
        }else{
            this.changeBuffer().then((loadedMore) => {
                if(loadedMore){
                    let chunk = this.getChunk(chunkSize);
                    this.push(chunk);
                }else{
                    this.push(null);
                }
            })
        }
    }

    getChunk(chunkSize){
        if(this.buffer){
            let chunk = this.buffer.slice(this.bufferPosition, this.bufferPosition + chunkSize);
            this.bufferPosition += chunkSize;
            return chunk;
        }
        return null;
    }
}
module.exports = new videoRepository()