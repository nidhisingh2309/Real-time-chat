const socket=io("http://localhost:8000");

//DOM in respective java script variables
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInp");
const messageContainer=document.querySelector(".container");
var audio=new Audio("/files/Message.mp3");

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
   // messageElement.classList.add('message');
    //messageElement.classList.add(position);
    if(position=="left"){
        audio.play();
        messageElement.classList.add('message-left');

    }
    else{
        messageElement.classList.add('message-right');
    }
    messageContainer.append(messageElement);
};


//Let a new user join
const name=prompt("Enter your name to join");
socket.emit("new-user-joined",name);


//send the event to others that someone joined
socket.on("user-joined",(name)=>{
    append(`${name} joined the chat`,"right");
});


//corresponding to receive value in index.js
socket.on("receive",(data)=>{
    append(`${data.name}:${data.message}`,"left")

});


//left message when someone leaves 
socket.on("left",(name)=>{
    append(`${name} left the chat!`,"left");
});


form.addEventListener("submit",(e)=>{
    //prevent default reloading of webpage
    e.preventDefault();
    const message=messageInput.value;
    //append message on your side
    append(`You:${message}`,"right");
    socket.emit("send",message);
    //empty the message container again
    messageInput.value="";

});


