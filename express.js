//REQUIRED MODULES
const express = require('express');
const app = express();
var path = require('path');
const hbs = require('express-handlebars');

//MODULE INITIALIZATION
const HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', hbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

//START-UP FUNCTIONS
function onHttpStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

//ROUTES
app.use(express.static('views'));

app.get('/', function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/main.html'));
  var myUser = {
    userName = "Mizu"
  }
  res.render('main', { layout: false });
});

app.get('/listing', function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/listing.html'));
  res.render('listing', { layout: false });
});

app.get('/room0', function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/room0.html'));
  res.render('room0', { layout: false });
});

app.get('/viewData', function (req, res) {
  //res.sendFile(path.join(__dirname + '/views/viewData.html'));
  var Register = [
    {
      fname: 'Mizuho',
      lname: 'Okimoto',
      email: 'mokimoto@myseneca.ca',
      password: 'Mizuho1121',
      visible: true,
    },
    {
      fname: 'Chiho',
      lname: 'Aoki',
      email: 'caoki@myseneca.ca',
      password: 'Chiho222',
      visible: true,
    },
    {
      fname: 'Sachie',
      lname: 'Aoki',
      email: 'aaoki@myseneca.ca',
      password: 'mom',
      visible: false,
    },
  ];

  res.render('viewData', {
    //ファイル名と同じ名前にしなきゃいけない
    //got some objects send it in data attributes of the render method, viewData is a template for rendering
    data: Register,
    layout: false,
  });
});

app.listen(HTTP_PORT, onHttpStart);
