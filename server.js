/// MARK: 🤖 Main server for the Quizicle website - - - - - - - - - - - - - - -

var express = require('express')
var handlebars = require('handlebars')
var expressHandlebars = require('express-handlebars')
var fs = require('fs')

var app = express()
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

var port = process.env.PORT || 3000

months = ['January','February','March','April','May','June','July','August','September','October','November','December']

///SECTION: Public functions

app.use(express.static('public'))

app.get('/', function(req, res) {
    lookupRecentQuizzes(3, function(result) {
        if (result) {
            res.status(200).render('home', {
                title: 'Quizicle',
                recents: result
            })
        } else {
            next()
        }
    })
})

app.get('/quiz/:quizID', function(req, res, next) {
    var quizID = req.params.quizID

    lookupQuiz(quizID, function(quiz) {
        if (quiz) {
            quiz.title = quiz.name + " - Quizicle"
            quiz.creation_date = getMonthYear(quiz.creation_date)

            res.status(200).render('quiz', quiz)
        } else {
            next()
        }
    })
})

app.get('/edit/:quizID', function(req, res, next) {
    var quizID = req.params.quizID

    // Look up quiz ID in DB
    next()
})

app.get('/search/:searchTerm', function(req, res, next) {
    var searchTerm = req.params.searchTerm;
    searchTerm=searchTerm.replace(/\+/g, ' ')
    var results={}
    searchCollection(searchTerm, function(results){
        if(results.length!=0){

            results.forEach(function(item, index) {
                item.creation_date = getMonthYear(item.creation_date)
            })

            res.status(200).render('results', {
                title: 'Search Results',
                search_results: results,
                query: searchTerm
            })
        }
        else{
            res.status(404).render('results', {
                title: "No Results",
                no_result: 1,
                query: searchTerm
            });

        }
    })

})

///SECTION: API Functions

app.get('/api/recent/:count', function(req, res, next) {
    var count = req.params.count

    lookupRecentQuizzes(count, function(result) {
        if (result) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/javascript')
            res.write(JSON.stringify(result))
            res.end()
        } else {
            next()
        }
    })
})

app.get('*', function(req, res) {
  res.status(404).render('404', {
      title: 'Oops!',
  })
})

function startServer() {
    app.listen(port, function() {
        console.log("🤖 Server is listening on port", port, "...\n")
    })
}

/// MARK: ☁️ Mongo Database for the Quizicle website - - - - - - - - - - - - -

var MongoClient = require('mongodb').MongoClient
var database
const quizCollection = 'quizzes'

// Set up Mongo DB parameters
var mongoDBHost = process.env.MONGODB_HOST
// Check if a port is specified, else default to the standard port
var mongoDBPort = process.env.MONGODB_PORT || 27017
var mongoDBUser = process.env.MONGODB_USER
var mongoDBPass = process.env.MONGODB_PASS
var mongoDBName = process.env.MONGODB_NAME

var mongoDBURL = 'mongodb://' + mongoDBUser + ':' + mongoDBPass + '@' +
    mongoDBHost + ':' + mongoDBPort + '/' + mongoDBName

MongoClient.connect(mongoDBURL, function(err, client) {
    if (err) {
        throw err
    }

    // Set a gloabl variable so it can be used by the whole middleware stack.
    database = client.db(mongoDBName)
    console.log("☁️  Connected to database.")

    startServer()

    database.collection(quizCollection).createIndex({
        name: "text",
        description: "text",
        tags: "text"
    })

    // Change this to `true` to clear the db and seed fresh from json.
    if (false) seedDatabaseFromJSON('./exampleQuizzes.json')

    // Change this to backup db. Do not use nodemon.
    if (false) backupDatabaseToJSON()
})

///SECTION: DB API functions

// Returns the json of the quiz with the given id.
async function lookupQuiz(quizID, completion) {
    var query = { _id: quizID }
    database.collection(quizCollection).find(query).toArray(function(err, result) {
        if (err) throw err;

        completion(result[0])
    });
}
//description tags name
async function searchCollection(searchTerm, completion) {
    var query = searchTerm.split('+').join(' ');

    database.collection(quizCollection).find({$text: {$search: query}}).toArray(function(err, result) {
        if (err) throw err;

        completion(result);
    });
}

// Returns an array of the <count> most recent quizzes.
// - count: Int, max number of quizzes to get.
async function lookupRecentQuizzes(count, completion) {
    var numberOfResults = parseInt(count)
    var sorting = { creation_date: -1 }
    database.collection(quizCollection).find().sort(sorting).toArray(function(err, result) {
        if (err) throw err

        // Get readable dates
        result.forEach(function(item, index) {
            item.creation_date = getMonthYear(item.creation_date)
        })

        console.log(result);

        completion(result.slice(0, numberOfResults))
    })
}

///SECTION: DB utility functions

// Backs up database to a JSON file with name backup<date>.json.
// ⚠️ Don't run in nodemon or it will cycle forever!
function backupDatabaseToJSON() {
    console.log("💾  Backing up database...");

    database.collection(quizCollection).find({}).toArray(function(err, allQuizzes) {
        if (err) throw err

        var today = new Date();
        var date = today.toISOString().substring(0, 10);

        var fileName = "./backup" + date + ".json"
        var fileContents = JSON.stringify(allQuizzes, null, " ");

        fs.writeFile(fileName, fileContents, (err) => {
            if (err) throw err

            console.log("💾  Back up complete.");
        });
    })
}

function seedDatabaseFromJSON(filePath) {
    console.log("⚠️  Seeding database from " + filePath);

    var quizzes = require(filePath)

    cleanUp(quizCollection, function() {
        createCollection(quizCollection, function() {
            database.collection(quizCollection).insertMany(quizzes, function(err, res) {
                if (err) throw err

            })
        })
    })
}

function listAllCollections(completion) {
    database.listCollections().toArray(function(err, collInfos) {
        if (err) throw err

        console.log(collInfos)
        if (completion) {
            completion()
        }
    })
}

function createCollection(collectionName, completion) {
    database.createCollection(collectionName, function(err, result) {
        if (err) throw err

        if (completion) {
            completion()
        }
    })
}

// Drops collection table if it exists
function cleanUp(collectionName, completion) {
    database.listCollections().toArray(function(err, result) {
        if (err) throw err
        var deleting = false

        result.forEach(result => {
            if (result.name == collectionName) {
                deleting = true
                deleteCollection(collectionName, function() {
                    completion()
                })
            }
        })

        if (!deleting) completion()
    })
}

function deleteCollection(collectionName, completion) {
    database.collection(collectionName).drop(function(err, delOK) {
        if (err) throw err

        if (completion) {
            completion()
        }
    })
}

///MARK: Utility Functions

function getMonthYear(timestamp) {
    var date = new Date(timestamp * 1000)

    var year = date.getFullYear()
    var month = months[date.getMonth()]

    return(month + " " + year)
}
