

const {userAuth} = require("../../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail")


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

 try{

   const fromUserId = req.user._id;
   const toUserId = req.params.toUserId;
   const status = req.params.status;



    // there is also another way to do this using schema.pre
   // if(fromUserId.equals(toUserId)){
   //    return res.status(400).json({message:"you cannot send connection request to yourself"});
   // }


   const allowedStatus = ["interested","ignored"];

   if(!allowedStatus.includes(status)){
        return res.status(400).send("Invalid status type :" + status)
   }



  const toUser = await User.findById({_id:toUserId});


  if(!toUser){
   return  res.status(400).json({message:"User doesnt exist"})
  }


   //If there is an existing ConnectionRequest

   const existingConnectionRequest = await ConnectionRequest.findOne({
    
    $or:[
  {fromUserId,toUserId},
  {fromUserId:toUserId,toUserId:fromUserId}
    ] 
     });

      
     if(existingConnectionRequest){
        
       return res.status(400).json({message:"already sended a connection request"})
   
     }




     const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
     })
    
     const data = await connectionRequest.save();


    //  const emailRes = await sendEmail.run("Request made by",req.user.firstName +" " + status + " successfully");
    //  console.log(emailRes)
    
     res.json({
      message:   req.user.firstName +" " + status + "successfully",
      data:data
     })
    }

 catch(e){
    res.status(400).send("Error : " + e.message)
 }


})

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{



try {

  const { status,requestId} = req.params;

  const loggedInUser = req.user;
  

  const allowedStatus = ["rejected","accepted"];

  if(!allowedStatus.includes(status)){

    return  res.status(400).json({message: "status inavlid"})
  };


  const connectionRequest = await ConnectionRequest.findOne({
    _id:requestId,
    toUserId:loggedInUser._id,
    status:"interested"
  });

   if(!connectionRequest) {
    return res.status(404).json({message:"No connection was found"})
   }


    connectionRequest.status=status;

    const data = await connectionRequest.save();

    res.json({message:"Connection request " + status,data});




  
} 

catch(e){
  res.status(400).send("Error : " + e.message)
}




})


module.exports = requestRouter;
