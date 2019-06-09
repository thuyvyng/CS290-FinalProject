// Main server for the Quizicle website

var express = require('express')
var handlebars = require('handlebars')
var expressHandlebars = require('express-handlebars')
var fs = require('fs')

var MongoClient = require('mongodb').MongoClient
var database
var quiz

// Set up Mongo DB parameters
var mongoDBHost = process.env.MONGODB_HOST
// Check if a port is specified, else default to the standard port
var mongoDBPort = process.env.MONGODB_PORT || 27017
var mongoDBUser = process.env.MONGODB_USER
var mongoDBPass = process.env.MONGODB_PASS
var mongoDBName = process.env.MONGODB_NAME

var mongoDBURL = "mongodb://" + mongoDBUser + ':' + mongoDBPass + '@' +
    mongoDBHost + ':' + mongoDBPort + '/' + mongoDBName

var exampleQuiz = require('./exampleQuiz.json')

var app = express()
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

var port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.status(200).render('home', {
        title: 'Quizicle'
    })
})

app.get('/quiz/:quizID', function(req, res, next) {
    var quizID = req.params.quizID
    // Look up quiz ID in DB
    // For now use the example object
    res.status(200).render('quiz', {
        title: 'Quiz',
        exampleQuiz
    })
})

app.get('/edit/:quizID', function(req, res, next) {
    var quizID = req.params.quizID
    // Look up quiz ID in DB
    next()
})

app.get('/search/:searchTerm', function(req, res, next) {
    var searchTerm = req.params.searchTerm
    // Search for quiz results in DB
    res.status(200).render('results', {
        title: 'Search Results',
        search_results: [exampleQuiz]
    })
})

app.get('*', function(req, res) {
  res.status(404).render('404', {
      title: 'Oops!',
  })
})

// Connect to the database and set the gloabl var so it can be used be the whole
// middleware stack.
// MongoClient.connect(mongoDBURL, function(err, client) {
//     if (err) {
//         throw err
//     }
//
//     database = client.db(mongoDBName)
//     console.log("☁️  Connected to database.")

    // Once the database is set up, start the server.
    app.listen(port, function() {
        console.log("🤖 Server is listening on port", port, "...\n")
    })
// })
