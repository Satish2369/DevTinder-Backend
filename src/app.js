console.log("backend project started")
require("dotenv").config();
const express = require('express');
const connectDB =  require("./config/database")
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const http = require("http");
const initialiseSocket = require("./utils/socket")



require("./utils/cronjob");

// Use cookie-parser middleware
//express.json() converts the json object to a  js object which can now be readable

const corsOptions = {
    origin: "http://localhost:5173",
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
const  chatRouter = require("./routes/chat");





   app.use("/",authRouter);
   app.use("/",profileRouter);
   app.use("/",requestRouter);
   app.use("/",userRouter);
   app.use("/",paymentRouter);
   app.use("/",chatRouter)

   
 const server = http.createServer(app);
 initialiseSocket(server);

connectDB().then(()=>{
    console.log("connection established")
server.listen(process.env.PORT,()=>{
 
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"));
















