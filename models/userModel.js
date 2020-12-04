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
  email: { type: String, required: true, unique: true },
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

//execute insert statement

module.exports = mongoose.model("User", UserSchema);

//---------------------------------------------------------------
/*
var mongoose = require("mongoose"); //create document database
var Schema = mongoose.Schema; //schema is object like a database

//const connStr = "mongodb://localhost/web322_week8";

//-- define database
//let db = mongoose.createConnection(connStr);
var db = mongoose.createConnection(process.env.mongoDB_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on("error", (err) => {
  console.log(`DB error : ${err}`);
});
db.once("open", () => {
  console.log("DB Connection Successes!");
});

//create user collection
//user schema
var userSchema = new Schema({
  username: String,
  fname: String,
  lname: String,
  email: String,
  DOB: Date,
  SIN: {
    type: Number,
    default: 0,
  },
  password: String,
});

//define a new model and put the model into the collection of Users,
var userModel = db.model("Users", userSchema);
module.exports = { userModel, saveUser };

// var Mizuho = new Usr({
//   username: "michan",
//   fname: "Mizuho",
//   lname: "Okimoto",
//   email: "mokimoto@myseneca.ca",
//   SIN: 1121222,
//   DOB: new Date(),
// });

var saveUser = function (newUser, userModel, FORM_DATA) {
  //execute insert statement
  newUser.save((err) => {
    if (err) {
      console.log("Error!");
    } else {
      console.log("Success: new user saved!");

      userModel
        .findOne({ email: FORM_DATA.email }) //find record
        .exec() //make promise(callback function)
        .then((usr) => {
          //find one and into it this usr
          if (!usr) {
            console.log("User could not find!");
          } else {
            console.log(usr);
          }
          process.exit;
        })
        .catch((err) => {
          console.log(`There was an error: ${err}`);
        });
    }
  });
};
*/
