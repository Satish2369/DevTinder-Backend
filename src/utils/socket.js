const { Server } = require("socket.io");
const crypto = require("crypto");

const initialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });


  const getRoomId = ({userId,toUserId})=>{

    return crypto.createHash("sha256").update([userId, toUserId].sort().join("_")).digest("hex");
  }

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
       const roomId = getRoomId(userId,toUserId);

      console.log(firstName + " joined " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({firstName, userId, toUserId, text}) => {
        const roomId = getRoomId(userId,toUserId);
        console.log(firstName + " " + text);
    io.to(roomId).emit("messageReceived",{firstName,text});


    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initialiseSocket;
