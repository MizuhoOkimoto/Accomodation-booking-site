import mongoose from "mongoose";
//REQUIRED MODULES
const express = require("express");
const app = express();
var path = require("path");
const hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose"); //create document database

//sequelize(week7)
const Sequelize = require("sequelize"); //capital S means actual module, lower s means instance module
const { SequelizeScopeError } = require("sequelize");

//handlebars
app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || 8080;

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(
  "d8bu4o6hhd0lhu",
  "rstyvuzkatrbqo",
  "bff2e7ea2668ddd31fa05777d3f9bba5b14ce557fbc778ae694647f0f24cee8f",
  {
    host: "ec2-54-159-107-189.compute-1.amazonaws.com",
    dialect: "postgres", //don't change it
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection Successful");
  })
  .catch(function (err) {
    console.log("Connection FAILED: ", err);
  });

//create a Model "Project"
var Project = sequelize.define("Project", {
  //define sequelize model -> the table name is Project
  //create table means "define"
  title: Sequelize.STRING(50), //databaseのコラムをpgAdmin内に追加してくれる //data types はweek7を参照
  description: Sequelize.TEXT, //databaseのコラムをpgAdmin内に追加してくれる
});

var User = sequelize.define("User", {
  firstName: Sequelize.STRING(40),
  lastName: Sequelize.STRING(40),
  title: Sequelize.STRING(50),
});

var Task = sequelize.define("Task", {
  //task assign to Users
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
});

//define relationships (foreign Key)
Project.hasMany(Task);
User.hasMany(Task);

//synchronized with database
sequelize.sync().then(function () {
  Project.create({
    //create means insert (CRUD) / "define" is "create table"
    title: "Project1",
    description: "Project 1 description here",
  })
    .then(function (project) {
      //instance of the Project model
      console.log("Project 1 created successfully - ID No: " + project.id);

      User.create({
        firstName: "Mizuho",
        lastName: "Okimoto",
        title: "Student",
      }).then(function (user) {
        console.log("User created"); //Do I need catch here??

        Task.create({
          title: "Task1",
          description: "Task 1 description",
          UserId: user.id,
          ProjectId: project.id,
        }).then(function () {
          console.log("Task 1 created"); //Do I need catch here??
        });

        Task.create({
          title: "Task2",
          description: "Task 2 description",
          UserId: user.id,
          ProjectId: project.id,
        }).then(function () {
          console.log("Task 2 created"); //Do I need catch here??
        });
      });
    })
    .catch(function () {
      console.log("FAILURE: something went wrong: " + error);
    });
}); //end .then(function (project)...

//注意！
sequelize.sync().then(function () {
  Task.findAll({}) //which means select * //whereを使ってデータを指定することもできる
    .then(function (data) {
      data = data.map((value) => value.dataValues);
      console.log("All Records");
      for (var i = 0; i < data.length; i++) {
        console.log(
          data[i].title + " - " + data[i].description + " - " + data[i].UserId
        );
      }
    });
});

// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "web322.assignment.mizuho@gmail.com",
    pass: "web322.assignment",
  },
});

//START-UP FUNCTIONS
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//変数を設定してページ内に名前を入れる
var myUser = {
  username: "Miz",
};

//ROUTES
app.use(express.static("views"));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("main", { data: myUser, layout: false });
});

app.get("/listing", function (req, res) {
  res.render("listing", { data: myUser, layout: false });
});

app.get("/room0", function (req, res) {
  res.render("room0", { data: myUser, layout: false });
});

app.get("/registration", function (req, res) {
  res.render("registration", { layout: false });
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

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/for-registration", function (req, res) {
  const FORM_DATA = req.body;
  console.log(FORM_DATA, "FORM_DATA");

  const DATA_OUTPUT =
    "<p style='text-align:center;'>" +
    // JSON.stringify(FORM_DATA) +
    "<p style='text-align:center;'> Welcome <strong>" +
    FORM_DATA.f_name +
    " " +
    FORM_DATA.l_name +
    "</strong> Thank you for your registration!";

  res.send(DATA_OUTPUT);

  //sending email
  var mailOptions = {
    from: "web322.assignment.mizuho@gmail.com",
    to: FORM_DATA.email,
    subject: "Test email from Node.js using nodemailer",
    //text: "just text",
    html:
      "<p>Hello " +
      FORM_DATA.f_name +
      "</p><p> Thank you for your registration!</p>",
  };

  //sending email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("ERROR: " + error);
    } else {
      console.log("SUCCESS: " + info.response);
    }
  });

  res.render("registration", { data: FORM_DATA, layout: false });
});

//TURN ON THE LISTENER
app.listen(HTTP_PORT, onHttpStart);
