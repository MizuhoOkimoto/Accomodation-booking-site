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
const PhotoModel = require("./models/photoModel"); //to connect photoModel.js
const PHOTODIRECTORY = ("./public/photos/");
const session = require('express-session');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird"); //use bluebird promise library with mongoose
// const dotenv = require("dotenv").config(); //dotenv
const bcrypt = require("bcryptjs"); //bcrypt
require("dotenv").config({ path: ".env" }); //CHANGE DIRECTORY
const fs = require("fs");
const _ = require('underscore');
const { model } = require("./models/userModel");


/* #region CONFIGURATIONS */
//handlebars --- register handlebars as the rending engine for views
//app.set("views", "./views"); //added it from 11/13 lecture
app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || 8080;

//express.session ????????? ----------
// app.use(
//   session({
//     secret: `${process.env.SECRET_KEY}`,
//     resave: false,
//     saveUninitialized: true,
//     // cookie: { secure: true },
//     cookie: { maxAge: 180 * 60 * 1000 },
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   })
// );

// app.use((req, res, next) => {
//   res.locals.user = req.session.userInfo;
//   res.locals.session = req.session;
//   next();
// });
//----------------------------------

//connect to my mongoDB database
mongoose.connect(process.env.mongoDB_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// log when the DB is connected
mongoose.connection.on("open", () => {
  console.log("Database connection open.");
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

//-------------------------------------------------
// const ensureLogin = (req, res, next) => {
//   req.session.user ? next() : res.redirect("/login");
// };

// const dashBoardLoader = (req, res) => {
//   req.session.user.type == "Admin"
//     ? res.render("user/admin-dashboard")
//     : res.render("user/user-dashboard");
// };
//---------------------------------------------------

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

//body-parser
app.use(bodyParser.json()); //テキストをJSONとして解析し、結果のオブジェクトをreq.bodyに公開
app.use(bodyParser.urlencoded({ extended: false })); //not use extended feature


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
    cb(null, Date.now() + path.extname(file.originalname)); //rename the file but keep the same extension name
  },
});
//tell to multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });



//-----------------------------------------------------------------------------

// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* #region ROUTES */
app.get("/", function (req, res) {
  res.render("main", { user: req.session.user, layout: false }); //added user: req.session.user
});

app.get("/listing", function (req, res) {
  res.render("listing", { user: req.session.user, layout: false });
});

//作り変える必要あり//
app.get("/listing", (req, res) => { model.find(); });
app.get("/listing/:filter", (req, res) => {
  const cityFilter = req.params.filter;
  model.find({ location: cityFilter })
});

//   res.render("listing", { user: req.session.user, layout: false });
// });


app.get("/roomDetail", function (req, res) {
  res.render("roomDetail", { user: req.session.user, layout: false });
});

app.get("/roomDetail/roomid", function (req, res) {
  res.render("roomDetail", { user: req.session.user, layout: false });
});

//後で使う！！！！！
// app.get("/login", function (req, res) {
//   model.find({ roomID: roomID });
//   res.render("login", { user: req.session.user, layout: false });
// });

app.get("/signup", function (req, res) {
  res.render("signup", { user: req.session.user, layout: false });
});


app.get("/login", function (req, res) {
  res.render("login", { user: req.session.user, layout: false });
});

app.post("/login", function (req, res) {

  if (req.body.login_email === "" || req.body.psw === "") {
    return res.render("login", { errorMsg: "Both user email and password are required,", user: req.session.user, layout: false });
  }

  userModel.findOne({ email: req.body.login_email })
    .exec()
    .then((user) => {

      if (!user) {
        res.render("login", { errorMsg: "login does not exist!", user: req.session.user, layout: false });
      }
      else { //when user exists
        if (req.body.login_email === user.email && req.body.psw === user.create_psw) {
          console.log('matched');
          req.session.user = {
            login_email: user.email,
            isAdmin: true, //or user.isAdmin???
            username: user.username,
            f_name: user.f_name,
            l_name: user.l_name,
          };
          if (user.isAdmin) {
            console.log('this account is admin');
            return res.redirect('adminDashboard');
          }
          return res.redirect('userDashboard');
        }
        else {
          // console.log('it stops after second else');
          res.render("login", { errorMsg: "login and password does not match!", user: req.session.user, layout: false });
        };
      };
    })
    .catch((err) => { console.log("An error occurred: ${err}") });
});


/* #region ADMIN DASHBOARD*/
app.get("/adminDashboard", ensureLogin, (req, res) => {　//findの結果が/then(photos)に入るようになる
  PhotoModel.find().lean()
    .exec()
    .then((photos) => {
      // underscore ( _ ) is a common library full of utility methods you can use
      // to make certain tasks a lot easier on yourself. Here we use underscore to
      // loop through the photos and and for each photo, set the uploadDate to a 
      // more user friendly date format. http://underscorejs.org/#each
      _.each(photos, (photo) => {
        photo.uploadDate = new Date(photo.createdOn).toDateString();
        //photo.caption = new String(photo.caption);
      });

      // send the html view with our form to the client
      res.render("adminDashboard", { user: req.session.user, photos: photos, hasPhotos: !!photos.length, layout: false });
    });
});

//upload photo
app.get("/add-photo", ensureLogin, (req, res) => {
  // send the html view with our form to the client
  res.render("add-photo", {
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/add-photo", upload.single("photo"), (req, res) => {
  // setup a PhotoModel object and save it
  const locals = {
    message: "Your photo was uploaded successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  const photoMetadata = new PhotoModel({
    name: req.body.name,
    email: req.body.email,
    caption: req.body.caption,
    filename: req.file.filename
  });

  photoMetadata.save()
    .then(() => {　　　//deleted response in the brackets
      res.render("add-photo", locals);
    })
    .catch((err) => {
      locals.message = "There was an error uploading your photo";

      console.log(err);

      res.render("add-photo", locals);
    });
});

app.post("/remove-photo/:filename", (req, res) => {
  // we are using the url itself to contain the filename of the photo we
  // want to remove. The :filename part of the url is a dynamic parameter
  // req.params holds the dynamic parameters of a url
  const filename = req.params.filename;

  // remove the photo
  PhotoModel.deleteOne({ filename: filename })
    .then(() => {
      // now remove the file from the file system.
      fs.unlink(PHOTODIRECTORY + filename, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("Removed file : " + filename);
      });
      // redirect to home page once the removal is done.
      return res.redirect("/adminDashboard");
    }).catch((err) => {
      // if there was an error removing the photo, log it, and redirect.
      console.log(err);
      return res.redirect("/adminDashboard");
    });
});

//-----------------------------------------------------------------------------------------

app.get("/logout", (req, res) => { //I do not create logout.hbs
  req.session.destroy();
  res.redirect("/");
});
//----------------------------------------------------------------------------------------


/* #region PROFILES */
app.get("/Profile", ensureLogin, (req, res) => {
  res.render("Profile", { user: req.session.user, layout: false });
});

app.get("/Profile/Edit", ensureLogin, (req, res) => {
  res.render("ProfileEdit", { user: req.session.user, layout: false });
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
      req.session.user = {
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
  console.log("Getting userdashboard " + req.session.user);
  res.render('userDashboard', { user: req.session.user, layout: false });
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
  //res.render("registration", { layout: false });
  res.render("registration", { user: req.session.users, layout: false });
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
    .then(users => {
      console.log(`User Created ${users}`);
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
/* #region END REGION */


app.get("/firstrunsetup", (req, res) => {
  /*
  var Clint = new userModel({
    username: 'Create Admin info',
    f_name: 'clint',
    l_name: 'MacDonald',
    email: 'mizuho.tiho@gmail.com',
    create_psw: 'mypassword',
    isAdmin: true,
    type: 'Admin'
  });
  Clint.save((err) => {
    console.log("Error: " + err + ';');
    if (err) {
      console.log("There was an error creating Clint: " + err);
    } else {
      console.log("Admin was created");
    }
  });
  console.log("Success");
  */
  res.redirect("/");
})


//TURN ON THE LISTENER
app.listen(HTTP_PORT, onHttpStart);

