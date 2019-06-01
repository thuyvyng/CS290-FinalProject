// Main server for the Quizicle website

var express = require('express');
var handlebars = require('handlebars')
var expressHandlebars = require('express-handlebars')

var app = express();
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(port, function () {
  console.log("🤖 Server is listening on port", port, "...\n")
});
