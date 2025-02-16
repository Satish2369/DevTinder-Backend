
const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();

const {userAuth} = require("../../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const USER_SAVE_DATA = "firstName lastName gender age skills about photoUrl";


userRouter.get("/user/requests/received",userAuth,async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const  connectionRequests = await connectionRequest.find({           
             toUserId : loggedInUser._id,
             status:"interested"
        }).populate("fromUserId",USER_SAVE_DATA);


        res.json({message:"data fetched successfully",
            data:connectionRequests
        });
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }




})


userRouter.get("/user/connections",userAuth,async(req,res)=>{

try{

    const loggedInUser = req.user;

    const connectionRequests  = await connectionRequest.find({
        $or: [
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"}
        ]
    }).populate("fromUserId",USER_SAVE_DATA).populate("toUserId",USER_SAVE_DATA);



  const data = connectionRequests.map((row)=>{

    if(row.fromUserId._id.equals(loggedInUser._id)){
 
        return row.toUserId;

    }
    else{
      return  row.fromUserId;
    }
  });




    res.json({message:"connections fetched",
        data:data
    })



}
catch(err){
    res.status(400).send("ERROR : " + err.message);
}



    










})

userRouter.get("/feed",userAuth,async(req,res)=>{

    try {


      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      limit = limit>50 ? 50:limit;

      const skip = (page-1)*limit;





     //user should not see his own card
     // cards which he has sended interested or ignored him or the profiles which he is connected with
     
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
         $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
         ]
    
        }).select("fromUserId toUserId")


      const hideUserFromFeed = new Set();

      connectionRequests.forEach((req)=>{
        hideUserFromFeed.add(req.fromUserId.toString())
        hideUserFromFeed.add(req.toUserId.toString())
    
    });

    // console.log(hideUserFromFeed);
    const users = await User.find({
       $and:[

        {_id:{$nin: Array.from(hideUserFromFeed)}},
        {_id:{$ne:loggedInUser._id}}
    ]
    }).select(USER_SAVE_DATA).skip(skip).limit(limit);


       res.json({data:users});
    }

    catch(err){ 
        res.status(400).send("ERROR :" + err.message)
    }
   


})






module.exports = userRouter;