
const validator = require("validator");


const validateSignUpData = (req)=>{


const {firstName,lastName,password,emailId}=req.body;


  if( !firstName  || !lastName){
     throw new Error("Name is not valid!");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid!");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("password is not strong!");
  }



}

const validateEditProfileData = (req)=>{


  const allowedEditFields = [
    "firstName","lastName","gender","about","skills","photoUrl","emailId","age"
  ]

 const isEditAllowed =  Object.keys(req.body).every((field)=> allowedEditFields.includes(field));

 const {photoUrl,skills} = req.body;
 if(photoUrl &&!validator.isURL(photoUrl)){
  throw new Error("NOt a valid URl")
 }
 else if (skills && (!Array.isArray(skills) || skills.length > 10)) {
  throw new Error("Skills must be an array with at most 10 items");
}






return isEditAllowed;

}

module.exports = {validateSignUpData,validateEditProfileData}