//-----------------------------------------------------------------------------------------------
var mongoose = require("mongoose"); //create document database
var Schema = mongoose.Schema; //schema is object like a database
//const bcrypt = require("bcryptjs");
mongoose.Promise = require("bluebird"); // making asynchronous nature and use 'bluebird' library

//const connStr = "mongodb://localhost/web322_week8";

//create user collection
//user schema
var UserSchema = new Schema({
  username: { type: String, required: true },
  f_name: { type: String, required: true },
  l_name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //check user does not exist //unique: trueを後で戻す
  create_psw: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  type: { type: String, default: "User" },
});

//後で追加！！！
// UserSchema.pre("save", function(next){

//   bcrypt.genSalt(10)
//   .then(salt=>{
//       bcrypt.hash(this.create_psw,salt)
//       .then(hash=>{
//           this.create_psw = hash
//           next();
//       })
//   })
// })

module.exports = mongoose.model("User", UserSchema); //What is "User" ???