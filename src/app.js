console.log("backend project started")
require("dotenv").config();
const express = require('express');
const connectDB =  require("./config/database")
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");



require("./utils/cronjob");

// Use cookie-parser middleware
//express.json() converts the json object to a  js object which can now be readable

const corsOptions = {
    origin: "http://localhost:5173",
   
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'] ,
    // Allow these headers
    credentials: true,
   
};
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
   app.use("/",authRouter);
   app.use("/",profileRouter);
   app.use("/",requestRouter);
   app.use("/",userRouter);
   app.use("/",paymentRouter);
   
 

connectDB().then(()=>{
    console.log("connection established")
app.listen(process.env.PORT,()=>{
 
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"));
















