const { Server } = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat")

const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
 

  const getRoomId = (userId,toUserId)=>{

    return crypto.createHash("sha256").update([userId, toUserId].sort().join("_")).digest("hex");
  }

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
       const roomId = getRoomId(userId,toUserId);

      console.log(firstName + " joined " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({firstName, lastName, userId, toUserId, text}) => {
        
         
       

       try {

        const roomId = getRoomId(userId,toUserId); 
         console.log(roomId);    
        console.log(firstName + " " + text);
         // save messages to the databases
     let  chat = await Chat.findOne({
      participants:{$all:[userId,toUserId]}
     })


     if(!chat){

       chat = new  Chat({

       participants:[userId,toUserId],
       messages:[]

       })
     }
       
   chat.messages.push({senderId:userId,text:text})

  await chat.save();


    io.to(roomId).emit("messageReceived",{firstName, lastName,text});


       }
       catch(error){
        console.log(error.message);
       }

    });
    socket.on("disconnect", () => {});
  });
};


module.exports = initialiseSocket;
