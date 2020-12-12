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
const roomModel = require("./models/roomModel");
const PHOTODIRECTORY = ("./public/photos/");
const session = require('express-session');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird"); //use bluebird promise library with mongoose
const bcrypt = require("bcryptjs"); //bcrypt
require("dotenv").config({ path: ".env" }); //CHANGE DIRECTORY
const fs = require("fs");
const _ = require('underscore');
const { model } = require("./models/userModel");
//#endregion

/* #region CONFIGURATIONS */
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
  duration: 10 * 60 * 1000, //2mins after cookie expires duration: 2 * 60 * 1000
  activeDuration: 1000 * 60, //let user logout automatically after this specific duration //it will reset the time when user move 
})
);

//#region AUTHENTICATION
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
function ensureAdmin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
//#endregion

//body-parser
app.use(bodyParser.json()); //テキストをJSONとして解析し、結果のオブジェクトをreq.bodyに公開
app.use(bodyParser.urlencoded({ extended: false })); //not use extended feature

//make sure the photos folder exists and if not create it
if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

//#region MULTER
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
//#endregion

// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* #region ROUTES */
app.get("/", function (req, res) {
  res.render("main", { user: req.session.user, layout: false }); //added user: req.session.user
});

app.get("/listing/:filter", (req, res) => {
  const cityFilter = req.params.filter;
  model.find({ location: cityFilter })
});

app.post("/search", (req, res, next) => {
  var location_id = req.body.location.toLowerCase();
  console.log(req.body.location);
  PhotoModel.find({ location: location_id }).lean()
    .exec()
    .then((roomdata) => {
      console.log(roomdata);

      res.render('listing', { layout: false, hasRooms: !!roomdata.length, rooms: roomdata, userInfo: req.session.userInfo });
    })
    .catch((err) => {
      console.log(err);
    });
});


/*#region ROOM LISTING PAGE */
app.get("/listing", function (req, res) {
  PhotoModel
    .find()
    .lean()
    .exec()
    .then((rooms) => {
      _.each(rooms, (photo) => {
        photo.uploadDate = new Date(photo.createdOn).toDateString();
      });
      res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user, layout: false })
    });
});

app.get("/roomDetail/:id", function (req, res) {
  let id_url = req.params.id;
  PhotoModel
    .find({ _id: id_url })
    .lean()
    .exec()
    .then((photos) => {
      res.render("roomDetail", { user: req.session.user, photos: photos, hasPhotos: !!photos.length, layout: false });
    });
});

app.get("/booking", ensureLogin, function (req, res) {
  res.render("booking", { user: req.session.user, layout: false });
});

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
            isAdmin: true, //or user.isAdmin??? Just put {{#if isAdmin}}
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

/* #region USER DASHBOARD*/
app.get("/userDashboard", ensureLogin, ensureAdmin, (req, res) => {
  console.log("Getting user dashboard " + req.session.user);
  res.render('userDashboard', { user: req.session.user, layout: false });
});

/* #region ADMIN DASHBOARD*/
// app.get("/adminDashboard", ensureAdmin, (req, res) => {　//findの結果が/then(photos)に入るようになる
//   PhotoModel.find().lean()
//     .exec()
//     .then((photos) => {
//       // underscore ( _ ) is a common library full of utility methods you can use
//       // to make certain tasks a lot easier on yourself. Here we use underscore to
//       // loop through the photos and and for each photo, set the uploadDate to a 
//       // more user friendly date format. http://underscorejs.org/#each
//       _.each(photos, (photo) => {
//         photo.uploadDate = new Date(photo.createdOn).toDateString();
//         //photo.caption = new String(photo.caption);
//       });

//       // send the html view with our form to the client
//       res.render("adminDashboard", { user: req.session.user, photos: photos, hasPhotos: !!photos.length, layout: false });
//     });
// });

app.get("/adminDashboard", ensureAdmin, (req, res) => {　//findの結果が/then(photos)に入るようになる
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

/* #region UPLOAD PHOTO*/
app.get("/add-photo", ensureLogin, (req, res) => {
  // send the html view with our form to the client
  res.render("add-photo", {
    layout: false // do not use the default Layout (main.hbs)
  });
});

app.post("/add-photo", upload.single("file"), (req, res) => {
  // setup a PhotoModel object and save it
  const locals = {
    message: "New room was uploaded successfully",
    layout: false // do not use the default Layout (main.hbs)
  };

  const photoMetadata = new PhotoModel({
    _id: req.body.ID,
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
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

app.get("/logout", (req, res) => { //I do not create logout.hbs
  req.session.destroy();
  res.redirect("/");
});

/* #region ROOMS */
app.get("/admin_RoomList", ensureAdmin, (req, res) => {
  roomModel.find()
    .lean()
    .exec()
    .then((rooms) => {
      res.render("admin_RoomList", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user, layout: false }); // !! can convert ot boolean
    });
});

app.get("/roomEdit", ensureAdmin, (req, res) => {
  res.render("roomEdit", { user: req.session.user, layout: false });
});

app.get("/roomEdit/:roomid", ensureAdmin, (req, res) => {
  const roomid = req.params.roomid;

  PhotoModel.findOne({ _id: roomid })
    .lean() //convert to JavaScript object
    .exec()
    .then((room) => {
      res.render("roomEdit", { user: req.session.user, room: room, editmode: true, layout: false })
      //.catch(() => { }); //TO DO!!!!!!!!!
    });
});

app.get("/admin_RoomList/Delete/:roomid", ensureAdmin, (req, res) => {
  const roomid = req.params.roomid;
  roomModel.deleteOne({ _id: roomid })
    .then(() => {
      res.redirect("/admin_RoomList");
    });
})

app.post("/roomEdit", ensureAdmin, (req, res) => {
  const room = new roomModel({
    _id: req.body.ID,
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price
  });

  if (req.body.edit === "1") {
    // editing
    roomModel.updateOne({ _id: room._id },
      {
        $set: {
          title: room.title,
          description: room.description,
          location: room.location,
          price: room.price
        }
      }
    ).exec().then((err) => {
      console.log("Something went wrong: "); //このエラーハンドリングでいい????? CHECK!!!
      res.redirect("/admin_RoomList");　//エラーハンドリング追加????? CHECK!!!
    });

  } else {
    //adding
    room.save((err) => {
      console.log("Something went wrong: check duplicate ID"); //このエラーハンドリングでいい????? CHECK!!!
      res.redirect("/admin_RoomList");
    });
  };
  console.log("the room was created");
  res.redirect("/adminDashboard");

});
/* #end region */

/* #region REGISTRATION */
app.get("/registration", function (req, res) {
  //res.render("registration", { layout: false });
  res.render("registration", { user: req.session.users, layout: false });
});

app.post("/registration", function (req, res) {

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
});


//TURN ON THE LISTENER
app.listen(HTTP_PORT, onHttpStart);

