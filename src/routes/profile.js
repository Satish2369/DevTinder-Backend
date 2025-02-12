
const express = require("express");
const profileRouter = express.Router();
const {userAuth} =  require("../../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const  {validatePassword} = require("../utils/validation")
  

profileRouter.get("/profile/view",userAuth, async (req,res)=>{
 
    try {
        const user = req.user;
        res.send(user);
    } 
    catch (err) {
        res.status(401).send("ERROR:" + err.message);
    }
  })


profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
                throw new Error("Invalid edit request ");
        }
        
        const loggedInUser = req.user;

        

   Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));
   
          

           await loggedInUser.save();

        res.json({ message: loggedInUser.firstName + " , your profile was updated successfully",
            Data:loggedInUser
        });
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
})


profileRouter.patch("/profile/password",userAuth,async(req,res) =>{

     const {oldPassword,newPassword} = req.body;


     const loggedInUser = req.user;
      
        

      

   
     try {
        // Validate the new password
        validatePassword(req);
    
        // Compare the old password with the stored password
        const comparePassword = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!comparePassword) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
    
        await loggedInUser.save();
    
        return res.json({ message: "Password updated successfully", data: loggedInUser });
      } catch (error) {
        return res.status(500).json({ message: error.message || "An error occurred" });
      }

})

module.exports = profileRouter;







