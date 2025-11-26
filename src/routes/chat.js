

const express = require("express");

const chatRouter = express.Router();
const Chat = require("../models/chat");
const {userAuth} = require("../../middlewares/auth")



chatRouter.get("/chat/:toUserId",userAuth,async(req,res)=>{


   try{
       console.log("request came")
      const {toUserId}= req.params;

     const userId = req.user._id;

      let  chat = await  Chat.findOne({
        participants : {$all:[userId,toUserId]}
      }).populate("messages.senderId"," firstName lastName emailId")


      if(!chat){

        chat = new Chat({

         participants :[userId,toUserId],
         messages:[]

        })

        await chat.save()
      

      }

      

      res.status(200).json(chat);

   }
   catch(e){

     console.error(e);
  res.status(500).json({ message: "Internal server error", error: e.message });

   }




})




module.exports = chatRouter;