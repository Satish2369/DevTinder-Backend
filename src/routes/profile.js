
const express = require("express");
const profileRouter = express.Router();
const {userAuth} =  require("../../middlewares/auth")

profileRouter.get("/profile",userAuth, async (req,res)=>{
 
    try {
        const user = req.user;
        res.send(user);
    } 
    catch (err) {
        res.status(401).send("ERROR:" + err.message);
    }
  })


module.exports = profileRouter;







