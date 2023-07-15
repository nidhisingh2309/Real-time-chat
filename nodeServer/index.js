require("dotenv").config();

const mongoose=require("mongoose");
const msgSchema=new mongoose.Schema({
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

    lastUpdatedAt:{
        type:Date,
        default:Date.now,

    },

    select:{
        type:String,
        required:true,
    },
});




// Node Server which will hand;e socket io connections
const io=require('socket.io')(8000,{
    cors:{
        origin:"*",
    },
});

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;
const MONGO_URI=`mongodb://${USERNAME}:${PASSWORD}@ac-hwwgvsa-shard-00-00.xuagiv5.mongodb.net:27017,ac-hwwgvsa-shard-00-01.xuagiv5.mongodb.net:27017,ac-hwwgvsa-shard-00-02.xuagiv5.mongodb.net:27017/?ssl=true&replicaSet=atlas-vqi651-shard-0&authSource=admin&retryWrites=true&w=majority`;;

async function run(){
    await mongoose
    .connect(MONGO_URI)
    .then(()=>console.log("Database connected successfully"))
    .catch((err)=>console.error("Database connection failed"))


mongoose.model("msg",msgSchema);

const users = {};

io.on('connection',(socket)=>{
    socket.on("new-user-joined",async(name)=>{
        
        users[socket.id]=name;
        socket.broadcast.emit("user-joined",name);

    });


    socket.on("send",(message)=>{

        updateListingBySelect("update",{
            message:message,
            name:users[socket.id],
            lastUpdatedAt:new Date(),
        });
        
        socket.broadcast.emit("receive",{
            message:message,
            name:users[socket.id],
        });
    });

    //disconnects the chat when someone leaves(inbuilt event-not userdefined)
    socket.on('disconnect',(message)=>{
        socket.broadcast.emit("left",users[socket.id]);
        delete users[socket.id];
    });
});




const createListing=async(newListing)=>{
    const result=await mongoose.model("msg").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
};

const updateListingBySelect=async(selectName,updatedListing)=>{
    const result=await mongoose
    .model("msg")
    .updateOne({select:selectName},{$set:updatedListing});

    console.log(`${result.modifiedCount}document(s) was/were updated`);
};

}

run();
