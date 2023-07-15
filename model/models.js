const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },

    name:{
        type:String,
        required:true,
    },

    room:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
    },

    select:{
        type:String,
        required:true,
    }
});

module.export.Message=mongoose.model('Message',messageSchema);