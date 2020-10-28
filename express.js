//REQUIRED MODULES
const express = require("express");
const app = express();
var path = require("path");
const hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || 8080;

//// body-parser モジュールを使えるようにセット
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "web322.assignment.mizuho@gmail.com",
    pass: "web322.assignment",
  },
});

app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

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
