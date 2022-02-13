const mongoose=require('mongoose')
const dotenv = require("dotenv")

dotenv.config()
const mongoURI=`${process.env.MONGOOSE_DATABASE_LINK}`;
const connetToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected with Mongoose, Database is rmg")
    })
}

module.exports =connetToMongo