const MongoClient = require("mongodb");

class MongoDatabase{
    async initConnection(url){
        this.client = await MongoClient.connect(url, { useUnifiedTopology: true })
    }
}

module.exports = new MongoDatabase();