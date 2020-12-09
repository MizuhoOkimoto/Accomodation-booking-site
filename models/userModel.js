//-----------------------------------------------------------------------------------------------
var mongoose = require("mongoose"); //create document database
var Schema = mongoose.Schema; //schema is object like a database
const bcrypt = require("bcryptjs");
mongoose.Promise = require("bluebird"); // making asynchronous nature and use 'bluebird' library

const connStr = "mongodb://localhost/web322_week8";
//const atlas =
//"mongodb+srv:dbUser:@Tiho3399@senecaweb.mvphj.mongodb.net/web322_week8?retryWrites=true&w=majority";

//define database

//create user collection
//user schema
var UserSchema = new Schema({
  username: String,
  f_name: { type: String, required: true },
  l_name: { type: String, required: true },
  email: { type: String, required: true }, //check user does not exist //unique: trueを後で戻す
  create_psw: { type: String, required: true },
});

//define a new model and put the model into the collection of Users,
// var userModel = db.model("Users", UserSchema);

// var newUser = new Usr({
//   username: req.body.username,
//   fname: "Mizuho",
//   lname: "Okimoto",
//   email: "mokimoto@myseneca.ca",
//   SIN: 888,
//   DOB: new Date(),
// });

module.exports = mongoose.model("User", UserSchema); //What is "User" ???