
const jwt = require("jsonwebtoken");
const User = require("../src/models/user");

const userAuth = async (req,res,next)=>{

   try {
     const {token} = req.cookies;


     if(!token){
        throw new Error("Token is not valid!!!!!")
     }

    const decodedObj = await jwt.verify(token,"DEV@Tinder$790")
   
    const {_id}= decodedObj;

    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    req.user = user; //now the next request handler will have access to this user
    next();

   }
   catch(e){
    res.status(400).send("ERROR "+ e.message)
   }
}

module.exports = {userAuth};












