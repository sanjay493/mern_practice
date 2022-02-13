const mongoose=require('mongoose')
const { Schema } = mongoose;


const DlyRate=new Schema({
    user1:{type:mongoose.Schema.Types.ObjectId,
       ref:'user'},
    user2:{type:mongoose.Schema.Types.ObjectId,
        ref:'user'},
    vegname:{
         type:String,
         required:true
    },
    price:{
        type:Number,
        required:true
   },
   unit:{
    type:String,
    required:true
},
   tag:{
       type:String,
       default:"Green"
   },
   date:{
       type:Date,
       default:Date.now
   },
})

module.exports=mongoose.model('dly_rate',DlyRate)