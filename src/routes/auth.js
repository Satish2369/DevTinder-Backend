const express = require("express");
const bcrypt = require("bcrypt"); 
const User = require("../models/user");
const validator = require("validator");
const {validateSignUpData} = require("../utils/validation")
const authRouter = express.Router();


authRouter.post('/signup', async (req,res)=>{

    try {
 //validation of the data
   validateSignUpData(req);


 //Encrypt the password
   
  const {password,firstName,lastName,emailId}=req.body;


 const passwordHash = await bcrypt.hash(password,10);
//    console.log(passwordHash);



// creating a new instance of the new user model
    const user = new User({
        firstName,lastName,emailId,password:passwordHash
    });


   const savedUser =   await user.save();

   const token = await savedUser.getJWT();
 
 
     //Add the token to cookie and send the respons e to the server       
     res.cookie("token",token,{
        expires:new Date(Date.now() + 8*3600000)
     });  



    res.json({message : "user saved successfully",
        data:savedUser
    })
}
catch (err) {
    res.status(400).send("Error: " + err.message)
}

})

authRouter.post("/login",async(req,res)=>{
   
    try{
     const{password,emailId} = req.body;
     
     if(!validator.isEmail(emailId)){
            throw new Error("Invalid emailId");
     }
 
     const user = await User.findOne({emailId:emailId});
 
     if(!user){
         throw new Error("Invalid credentials");
     }
 
     const isPasswordValid = await user.validatePassword(password);
 
 
    if(isPasswordValid){
    
     //Create a JWt Token
 
    const token = await user.getJWT();
 
 
     //Add the token to cookie and send the respons e to the server       
     res.cookie("token",token,{
        expires:new Date(Date.now() + 8*3600000)
     });  
 
      res.send(user);
    }
    else{
     throw new Error("Invalid credentials")
    } 
 
    }
    catch(err){
 
     res.status(400).send("ERROR :" + err.message)
    }
 
 })





 authRouter.post("/logout",(req,res)=>{


    res.cookie("token",null,{
        expires: new Date(Date.now())
    })

   res.send("logout successfully");

 })






module.exports = authRouter;