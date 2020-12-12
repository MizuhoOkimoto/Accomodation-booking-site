// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require("bluebird");

// define the photo schema
const photoSchema = new Schema({
    "_id": {
        type: Number
    },
    "filename": {
        type: String,
        unique: true
    },
    "title": String,
    "description": String,
    "location": String,
    "price": Number,
    "createdOn": {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("photos", photoSchema); //"photosはMongoDB内でのコレクション名になる"