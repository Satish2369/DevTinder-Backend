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

 app.get("/practiseId", async (req, res) => {
    const Id = req.body._id;

    if (!Id) {
        return res.status(400).send("Invalid id");
    }

    try {
        const user = await User.findById(Id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (e) {
        // Check if the error is related to invalid ObjectId
        if (e.kind === 'ObjectId') {
            res.status(400).send("Invalid id format");
        } else {
            res.status(500).send("Something went wrong");
        }
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




connectDB().then(()=>{
    console.log("connection established")
    
app.listen(3000,()=>{
console.log("Server is successfully listening on port on 3000");
})
}).catch(err=>console.error("database cannot be connected"))
















