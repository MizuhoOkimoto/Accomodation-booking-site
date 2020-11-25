//require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require("bluebird");

//define database
let db = mongoose.createConnection(config.dbconn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create user collection
//user schema
var UserSchema = new Schema({
  username: String,
  fname: String,
  lname: String,
  email: String,
  SIN: {
    type: Number,
    default: 0,
  },
  DOB: Date,
});

//define a new model and put the model into the collection of Users,
//var Usr = db.model("Usr", UserSchema);
module.exports = db.model("Usr", UserSchema);

//module.exports = mongoose.model("Users", UserSchema);
