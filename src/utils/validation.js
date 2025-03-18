
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
const validateEditProfileData = (req) => {
  const allowedEditFields = [
      "firstName", "lastName", "gender", "about", "skills", "photoUrl", "emailId", "age"
  ];

  // Check if all fields in req.body are allowed
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  if (!isEditAllowed) {
      throw new Error("Invalid field(s) in request.");
  }

  const { photoUrl, skills } = req.body;

  if (photoUrl && !validator.isURL(photoUrl)) {
      throw new Error("Not a valid URL");
  }

  if (skills && (!Array.isArray(skills) || skills.length > 10)) {
      throw new Error("Skills must be an array with at most 10 items");
  }

  return true; // Explicitly return `true` when validation passes
};


const validatePassword = (req)=>{


  
  if(!validator.isStrongPassword(req.body.newPassword)){
      throw new Error("password is not strong");
  }



}

module.exports = {validateSignUpData,validateEditProfileData,validatePassword}