var mongoose = require("mongoose"); //create document database
var Schema = mongoose.Schema; //schema is object like a database
mongoose.Promise = require("bluebird"); // making asynchronous nature and use 'bluebird' library

//create user collection
//room list schema
var roomListSchema = new Schema({
    "_id": {
        type: Number
    },
    "title": String,
    "description": String,
    "location": String,
    "price": String,
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

module.exports = mongoose.model("admin_RoomList", roomListSchema); //Room_list will be a collection name in db