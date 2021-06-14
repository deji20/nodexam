const dbConnection = require(`../database/mongoDatabase`).client;
const bcrypt = require("bcrypt");
const {ObjectId} = require("mongodb");
const saltRounds = 10;

class userRepository{
    constructor(){
        this.collection = dbConnection.db("tooSecond").collection("users");
    }

    async create(user){
        let match = await this.collection.find({username: user.username}).toArray();
        console.log(match);
        if(!match.length){
            user.password = await bcrypt.hash(user.password, saltRounds);
            let result = await this.collection.insertOne(user);
            return result.ops[0];
        }else{
            throw new Error("Username Taken");
        }
    }
    async delete(userId){
        return await this.collection.deleteOne({ _id:ObjectId(userId)})
    }

    async update(user){
        return await this.collection.updateOne({_id:user._id}, user); 
    }

    async verifyUser(user){
        let match = await this.collection.find({username: user.username}).toArray();
        return match[0] && bcrypt.compareSync(user.password, match[0].password);
    }
}

module.exports = new userRepository();