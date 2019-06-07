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

app.get('*/style.css', function(req, res) {
    fs.readFile('public/style.css', function read(err, data) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/css')
        res.write(data)
        res.end()
    })
})

app.get('*/global.css', function(req, res) {
    fs.readFile('public/global.css', function read(err, data) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/css')
        res.write(data)
        res.end()
    })
})

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

app.get('/make/', function(req, res, next) {
	res.status(200).render('editQuiz');
});

app.get('*', function(req, res) {
  res.status(404).render('404')
})

app.listen(port, function() {
    console.log("🤖 Server is listening on port", port, "...\n")
});
