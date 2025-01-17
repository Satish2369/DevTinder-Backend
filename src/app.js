console.log("backend project started")

const express = require('express');
const connectDB =  require("./config/database")
const app = express();
const User = require("./models/user")
const bcrypt = require("bcrypt"); 
const validator = require("validator");

const {validateSignUpData} = require("./utils/validation")

app.use(express.json()); 

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


app.get("/user", async (req,res)=>{


    const userEmail = req.body.emailId;
    
    try{
       const user = await User.find({emailId:userEmail});


       if(user.length===0){
           res.status(404).send("user not found")
       }
       else{
        res.send(user);
       }
       
    }
    catch (err) {
        res.status(400).send("something went wrong:" + err.message)
    }
   


});





//get all the users from the users database
 app.get("/feed",async(req,res)=>{

    const userEmail = req.body.emailId;
try{
  const user=  await User.findOne({emailId:userEmail});

  if(!user){
    res.status(404).send("user not found")
  }
  res.send(user);
}
 catch (err) {
        res.status(400).send("something went wrong:" + err.message)
    }
   


 });



app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;


    try{
        const user = await User.findByIdAndDelete({_id:userId});
        console.log("user deleted")
        res.send("user deleted successfully")

    }

    catch (err) {
        res.status(400).send("something went wrong:" + err.message)
    }
})

app.patch("/user/:userId",async (req,res)=>{ 

    const userId = req.params.userId;
    const data= req.body;

    try{
        const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"]

   const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));

   if(!isUpdateAllowed){
    throw new Error("update not allowed");
   }
      const user = await User.findByIdAndUpdate({_id:userId},data,{runValidators:true,returnDocument:true});
      
      console.log(user)
        res.send("user updated successfully");


    }

    catch (err) {
        res.status(400).send("something went wrong:" + err.message)
    }
})

app.post("/login",async(req,res)=>{
   
   try{
    const{password,emailId,firstName,lastName} = req.body;
    
    if(!validator.isEmail(emailId)){
           throw new Error("Invalid emailId");
    }

    const user = await User.findOne({emailId:emailId});

    if(!user){
        throw new Error("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);


   if(isPasswordValid){
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



connectDB().then(()=>{
    console.log("connection established")
    
app.listen(3000,()=>{
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"))
















