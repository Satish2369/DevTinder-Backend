console.log("backend project started")

const express = require('express');
const connectDB =  require("./config/database")
const app = express();
const cookieParser = require('cookie-parser');

// Use cookie-parser middleware
//express.json converts the json object to a  js object which can now be readable

app.use(express.json()); 
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");



   app.use("/",authRouter);
   app.use("/",profileRouter);
   app.use("/",requestRouter);
  


   
connectDB().then(()=>{
    console.log("connection established")
    
app.listen(3000,()=>{
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"))
















