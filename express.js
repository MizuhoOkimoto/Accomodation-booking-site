const express = require('express');
const app = express();
var path = require('path');
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

app.use(express.static('views'));

// app.use('/views/stylesheet', express.static('views/stylesheet'),function(req,res,next){
//     next();
// });

// app.get('/views/script.js', function (req, res) {
//     res.sendFile(path.join(__dirname, 'views/script.js'))
//   });
// app.get('/stylesheet.css', function (req, res) {
//     res.sendFile(path.join(__dirname, 'views/stylesheet.css'))
//   });

// app.use(express.static('views'));

// app.use('./script', express.static('script'),function(req,res,next){
//     next();
// });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/main.html'));
});

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

app.listen(HTTP_PORT, onHttpStart);
