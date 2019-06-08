// Main server for the Quizicle website

var express = require('express')
var handlebars = require('handlebars')
var expressHandlebars = require('express-handlebars')
var fs = require('fs')

var exampleQuiz = require('./exampleQuiz.json')

var app = express()
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

var port = process.env.PORT || 3000

app.get("*/public/:page", function (req, res, next) {
    var page = req.params.page
    console.log("Redirecting");
    console.log(req.originalUrl)
    res.redirect('/' + page)
})

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.status(200).render('home')
})

app.get('/quiz/:quizID', function(req, res, next) {
    var quizID = req.params.quizID
    // Look up quiz ID in DB
    // For now use the example object
    res.status(200).render('quiz',exampleQuiz)
})

app.get('/edit/:quizID', function(req, res, next) {
    var quizID = req.params.quizID
    // Look up quiz ID in DB
    next()
})

app.get('/search/:searchTerm', function(req, res, next) {
    var searchTerm = req.params.searchTerm
    // Search for quiz results in DB
    next()
})

app.get('/create/', function(req, res, next) {
	res.status(200).render('editQuiz');
});

app.get('*', function(req, res) {
  res.status(404).render('404')
})

app.listen(port, function() {
    console.log("🤖 Server is listening on port", port, "...\n")
});
