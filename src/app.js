console.log("backend project started")

const express = require('express');

const app = express();

app.use( "/test",(req,res)=>{
    res.send("hello world");
})

app.use( "/first",(req,res)=>{ 
    res.send("hello coder hello bhai");
})


app.listen(3000,()=>{
    console.log("Server is successfully listening on port on 3000")
})