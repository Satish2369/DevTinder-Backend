console.log("backend project started")

const express = require('express');
 const connectDB =  require("./config/database")
 const app = express();
const User = require("./models/user")

// app.get("/user",(req,res,next)=>{
  
//    next()
// //    res.send("response1")
// },
// (req,res,next)=>{
//     // res.send("response2")
//     next();
// }
// ,(req,res,next)=>{
//     res.send("response2")
// }
// )


app.post('/signup', async (req,res)=>{

    const userObj ={
        firstName:"MS",
        lastName:"Dhoni",
        emailId:"Dhoni410@gmail.com",
        password:"Dhoni@123"
    }
// creating a new instance of the new user model
    const user = new User(userObj)
try {
    await user.save();
    res.send("user added successfully")
}
catch (err) {
    res.status(400).send("Error saving the user:" + err.message)
}

})

connectDB().then(()=>{
    console.log("connection established")
    
app.listen(7000,()=>{
    console.log("Server is successfully listening on port on 7777")
})
}).catch(err=>console.error("database cannot be cpnnected"))













