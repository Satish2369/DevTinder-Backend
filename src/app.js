console.log("backend project started")

const express = require('express');
const connectDB =  require("./config/database")
const app = express();
const User = require("./models/user")
const bcrypt = require("bcrypt"); 
const validator = require("validator");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const {userAuth} = require("../middlewares/auth")

// Use cookie-parser middleware


const {validateSignUpData} = require("./utils/validation")

app.use(express.json()); 
app.use(cookieParser());

//express.json converts the json object to a  js object which can now be readable

app.post('/signup', async (req,res)=>{

    try {
 //validation of the data
   validateSignUpData(req);


 //Encrypt the password
   
  const {password,firstName,lastName,emailId}=req.body;


 const passwordHash = await bcrypt.hash(password,10);
   console.log(passwordHash);



// creating a new instance of the new user model
    const user = new User({
        firstName,lastName,emailId,password:passwordHash
    });


    await user.save();
    res.send("user added successfully")
}
catch (err) {
    res.status(400).send("Error: " + err.message)
}

})


app.post("/login",async(req,res)=>{
   
    try{
     const{password,emailId} = req.body;
     
     if(!validator.isEmail(emailId)){
            throw new Error("Invalid emailId");
     }
 
     const user = await User.findOne({emailId:emailId});
 
     if(!user){
         throw new Error("Invalid credentials")
     }
 
     const isPasswordValid = await user.validatePassword(password);
 
 
    if(isPasswordValid){
    
     //Create a JWt Token
 
    const token = await user.getJWT();
 
 
     //Add the token to cookie and send the respons e to the server       
     res.cookie("token",token,{
        expires:new Date(Date.now() + 8*3600000)
     });  
 
 
      res.send("login Succcessful!!!")
    }
    else{
     throw new Error("Invalid credentials")
    }
 
    }
    catch(err){
 
     res.status(400).send("ERROR :" + err.message)
    }
 
 
 
 
 })
 
 
 app.get("/profile",userAuth, async (req,res)=>{
 
     try {
         const user = req.user;
         res.send(user);
     } 
     catch (err) {
         res.status(401).send("ERROR:" + err.message);
     }
   })
 
app.post("/sendConnectionRequest",userAuth , async (req,res)=>{

    const user = req.user;
    console.log("connection request");
    res.send(user.firstName +" sent the connection");
   })




    
connectDB().then(()=>{
    console.log("connection established")
    
app.listen(3000,()=>{
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"))
















