console.log("backend project started")

const express = require('express');
 const connectDB =  require("./config/database")
 const app = express();
const User = require("./models/user")


app.use(express.json()); 

//express.json converts the json object to a  js object which can now be readable 

app.post('/signup', async (req,res)=>{

 //  console.log(req.body);

    
// creating a new instance of the new user model
    const user = new User(req.body);

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
















