/* #region REQUIRES */
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

/* #region CONFIGURATIONS */
//handlebars --- register handlebars as the rending engine for views
//app.set("views", "./views"); //added it from 11/13 lecture
app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || 8080;

//connect to my mongoDB database
mongoose.connect(process.env.mongoDB_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//START-UP FUNCTIONS --- call this function after the server starts listening for requests ---
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//ROUTES
app.use(express.static("views"));
app.use(express.static("public"));

//use cookie method -- client session
app.use(clientSessions({
  cookieName: "session",
  secret: "do not read my cookie",
  duration: 2 * 60 * 1000, //2mins after cookie expires
  activeDuration: 1000 * 60, //let user logout automatically after this specific duration //it will reset the time when user move 
})
);

//body-parser
app.use(bodyParser.json()); //テキストをJSONとして解析し、結果のオブジェクトをreq.bodyに公開
app.use(bodyParser.urlencoded({ extended: false })); //not use extended feature

/* #region SECURITY */
function ensureLogin(req, res, next) {
  if (!req.session.login_user) {
    res.render("login", { errorMsg: "Unauthorized access, please log in", layout: false });
  } else {
    next();
  }
};


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
//tell to multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });



//-----------------------------------------------------------------------------

// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//I HAVE TO DELETE IT AFTER CONNECT WITH MONGODB
const login_user = [{
  login_email: "Mizuho",
  psw: "Mizuho1121"
}];

/* #region ROUTES */
app.get("/", function (req, res) {
  res.render("main", { login_user: req.session.login_user, layout: false }); //added user: req.session.user
});

app.get("/listing", function (req, res) {
  res.render("listing", { login_user: req.session.login_user, layout: false });
});

app.get("/room0", function (req, res) {
  res.render("room0", { login_user: req.session.login_user, layout: false });
});

app.get("/login", function (req, res) {
  res.render("login", { login_user: req.session.login_user, layout: false });
});

app.get("/signup", function (req, res) {
  res.render("signup", { layout: false });
});


app.get("/login", function (req, res) {
  res.render("login", { login_user: req.session.login_user, layout: false });
});

app.post("/login", function (req, res) { //Do I need to use check???

  const login_email = req.body.login_email;
  const psw = req.body.psw;

  //TO DO

  // var isValid = true;
  // var errorMessage = "";
  // if (!check) { isValid = false; errorMessage += ""; }
  // if (!check) { isValid = false; errorMessage += ""; }
  // if (!check) { isValid = false; errorMessage += ""; }
  // if (!check) { isValid = false; errorMessage += ""; }
  // if (!isValid) {
  //   return res.render("login", { errorMsg: errorMassage, user: req.session.login_user, layout: false });
  // } else {
  //
  //   //TO DO
  //
  // }

  if (login_email === "" || psw === "") {
    return res.render("login", { errorMsg: "Both email and password are required!", login_user: req.session.login_user, layout: false });
  }
  if (login_email === login_user.login_email && psw === login_user.psw) {  //authenticate //psw === login_user.pswではなくresult=trueに変更(12/4 week11) 
    console.log("matched");
    req.session.login_user = {
      login_email: login_user.login_email,
      psw: login_user.psw
    };
    res.redirect("/userDashboard");
  }
  else {
    res.render("login", { errorMsg: "Either the login email or password does not exist", login_user: req.session.login_user, layout: false });

  }
});

app.get("/logout", (req, res) => { //I do not create logout.hbs
  req.session.reset();
  res.redirect("/");
});


/* #region PROFILES */
app.get("/Profile", ensureLogin, (req, res) => {
  res.render("Profile", { login_user: req.session.login_user, layout: false });
});

app.get("/Profile/Edit", ensureLogin, (req, res) => {
  res.render("ProfileEdit", { login_user: req.session.login_user, layout: false });
});

app.post("/Profile/Edit", ensureLogin, (req, res) => {
  const username = req.body.username;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const Email = req.body.email;
  const isAdmin = (req.body.isAdmin === "on");

  userModel.updateOne(
    { username: username },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        email: Email,
        isAdmin: isAdmin
      }
    }
  ).exec()
    .then(() => {
      req.session.login_user = {
        username: username,
        email: Email,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin
      };
      res.redirect("/Profile");
    });
  /*    .then((err) => {
          if (err) {
              console.log("An error occurred while updating the profile: " + err);
          } else {
              console.log("Profile " + req.body.username + " updated successfully");
          }
      })
      .catch((err) => {
          console.log("ERROR: " + err);
      });
  */
});

app.get("/userDashboard", ensureLogin, (req, res) => {
  res.render('userDashboard', { login_user: req.session.login_user, layout: false });
});

app.get("/userDashboard", function (req, res) {
  res.render("userDashboard", { layout: false });
});

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

/* #region REGISTRATION */
app.get("/registration", function (req, res) {
  res.render("registration", { layout: false });
  //res.render("registration", { login_user: req.session.login_user, layout: false });
});

app.post("/registration", function (req, res) {
  mongoose.connect(process.env.mongoDB_atlas, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then(() => {
      console.log("Connected to MongoDB");
    });

  //FORM_DATA
  const Form_data = req.body;

  //Mongo Atlasに表示されてる名前
  const user = {
    f_name: Form_data.f_name,
    l_name: Form_data.l_name,
    email: Form_data.email,
    create_psw: Form_data.create_psw, //keep it in privacy
  };

  const newUser = new userModel(user);

  newUser.save()
    .then(user => {
      console.log(`User Created ${user}`);
    })
    .catch(err => {
      console.log(`There is an error: ${err}`);
      process.exit(1); //stop running and return error message
    });
  /*
  const DATA_OUTPUT =
    "<p style='text-align:center;'>" + // JSON.stringify(FORM_DATA) + ????
    "<p style='text-align:center;'> Welcome <strong>" +
    Form_data.f_name +
    " " +
    Form_data.l_name +
    "</strong> Thank you for your registration!";

  res.send(DATA_OUTPUT);
*/
  //res.render("registration", { data: DATA_OUTPUT, layout: false });

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
    subject: "Registration Confirmation - ANY -",
    //text: "just text",
    html: "<p>Hello " + Form_data.f_name + "</p><p> Thank you for signing up for ANY!</p>"
      + "Your email address is: " + Form_data.email
  };

  //sending email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("ERROR: " + error);
    } else {
      console.log("SUCCESS: " + info.response);
    }
  });

  res.render("registration", { user: user, layout: false });
});

//TURN ON THE LISTENER
app.listen(HTTP_PORT, onHttpStart);

/* #region END REGION */