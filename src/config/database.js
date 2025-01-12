const mongoose = require('mongoose')

const connectDB = async () => {

  await  mongoose.connect("mongodb+srv://satish:lLG1D20dokDUcjV8@namastenode.dr839.mongodb.net/devTinder");

}

module.exports = connectDB;
