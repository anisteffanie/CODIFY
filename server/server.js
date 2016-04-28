var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/api/tutor_signup', function(req, res) {

   console.log("signupTutor", req.body)
   res.send("hiii");

})

app.post('/api/student_signup', function(req, res) {

   console.log("signupStudent", req.body)
   res.send("hiii");

})

app.listen(port, function() {
  console.log('Listening on port ' + port);
})
