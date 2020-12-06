//import mongoose from "mongoose";
//REQUIRED MODULES
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const clientSessions = require("client-sessions");
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird"); //use bluebird promise library with mongoose
// const dotenv = require("dotenv").config(); //dotenv
const bcrypt = require("bcryptjs"); //bcrypt
require("dotenv").config({ path: ".env" }); //CHANGE DIRECTORY
const fs = require("fs");
const PHOTODIRECTORY = "./public/photos";

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || process.env.PORTLocal;

//START-UP FUNCTIONS --- call this function after the server starts listening for requests ---
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//make sure the photos folder exists and if not create it
if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

//multer requires a few options to be setup to store files with file extensions
//by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    //we write the filename as the current date down to the millisecond
    //in a large web service this world possibly cause a problem if two people
    //upload an image at the exact same time. A better way would be to use GUID's for filename
    //this is a simple example
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
//tell to multer to use the diskStrage function for naming files instead of the default.
const upload = multer({ storage: storage });

//handlebars --- register handlebars as the rending engine for views
app.set("views", "./views"); //added it from 11/13 lecture
app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//-----------------------------------------------------------------------------

// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });



app.use(
  clientSessions({
    cookieName: "session",
    secret: "do not read my cookie",
    duration: 2 * 60 * 1000, //2mins
    activeDuration: 1000 * 60, //let user logout automatically after this specific duration
  })
);

//body-parser
app.use(bodyParser.json()); //テキストをJSONとして解析し、結果のオブジェクトをreq.bodyに公開
app.use(bodyParser.urlencoded({ extended: false })); //not use extended feature


//ROUTES
app.use(express.static("views"));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("main", { layout: false });
});

app.get("/listing", function (req, res) {
  res.render("listing", { layout: false });
});

app.get("/room0", function (req, res) {
  res.render("room0", { layout: false });
});

app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

app.get("/signup", function (req, res) {
  res.render("signup", { layout: false });
});

//I HAVE TO DELETE IT AFTER CONNECT WITH MONGODB
const login_user = {
  login_email: "Mizuho",
  psw: "Mizuho1121"
};

app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

app.post("/login", function (req, res) { //Do I need to use check???

  const login_email = req.body.login_email;
  const psw = req.body.psw;

  if (login_email === "" || psw === "") {
    return res.render("login", { errorMsg: "Both email and password are required!", layout: false });
  }
  if (login_email === login_user.login_email && psw === login_user.psw) {  //authenticate
    req.session.user = {
      login_email: user.login_email,
      psw: user.psw
    };
    res.redirect("/userDashboard");
  }
  else {
    res.render("login", { errorMsg: "Either the login email or password does not exist", layout: false });

  }
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/registration", function (req, res) {
  res.render("registration", { layout: false });
});

// app.get("/userDashboard", checkLogin, (req, res) => {
//   res.render('userDashboard', { user: req.session.user, layout: false });
// });

app.get("/viewData", function (req, res) {
  var Register = [
    {
      fname: "Mizuho",
      lname: "Okimoto",
      email: "mokimoto@myseneca.ca",
      password: "Mizuho1121",
      visible: true,
    },
  ];
  res.render("viewData", {
    //ファイル名と同じ名前にしなきゃいけない
    //got some objects send it in data attributes of the render method, viewData is a template for rendering
    data: Register,
    layout: false,
  });
});

//connect to my mongoDB database
app.post("/for-registration", function (req, res) {
  mongoose
    .connect(process.env.mongoDB_atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    });

  //FORM_DATA
  const Form_data = req.body;

  const user = {
    f_name: Form_data.f_name,
    l_name: Form_data.l_name,
    email: Form_data.email,
    create_psw: Form_data.create_psw, //keep it in privacy
  };

  const newUser = new userModel(user);

  newUser
    .save()
    .then(user => {
      console.log(`User Created${user}`);
    })
    .catch(err => {
      console.log(`There is an error: ${err}`);
      process.exit(1); //stop running and return error message
    });

  const DATA_OUTPUT =
    "<p style='text-align:center;'>" + // JSON.stringify(FORM_DATA) + ????
    "<p style='text-align:center;'> Welcome <strong>" +
    Form_data.f_name +
    " " +
    Form_data.l_name +
    "</strong> Thank you for your registration!";

  //sending email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodemailer_user,
      pass: process.env.nodemailer_pass,
    },
  });

  var mailOptions = {
    from: "web322.assignment.mizuho@gmail.com",
    to: Form_data.email,
    subject: "Test email from Node.js using nodemailer",
    //text: "just text",
    html: "<p>Hello " + Form_data.f_name + "</p><p> Thank you for your registration!</p>",
  };

  //sending email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("ERROR: " + error);
    } else {
      console.log("SUCCESS: " + info.response);
    }
  });

  res.render("registration", { data: Form_data, layout: false });
});

//TURN ON THE LISTENER
app.listen(HTTP_PORT, onHttpStart);