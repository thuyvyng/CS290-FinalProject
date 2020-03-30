/// MARK: 🤖 Main server for the Quizicle website - - - - - - - - - - - - - - -

var express = require('express')
var handlebars = require('handlebars')
var expressHandlebars = require('express-handlebars')
var bodyParser = require('body-parser')
var fs = require('fs')

var app = express()
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// var port = process.env.PORT || 3000
const port = 3000

app.use(bodyParser.json())
app.use(express.static('public'))

///SECTION: Public functions


app.get('/', function(req, res) {
    res.status(200).render('home', {
        title: 'Quizicle',
        recents: [
            { file_name: "/exampleQuizzes.json" }
        ],
        scripts: [
            {file_name: "/search.js"}
        ]
    })
        
    
})

app.get('/quiz/:quizID', function(req, res, next) {
    var quizID = req.params.quizID

    lookupQuiz(quizID, function(quiz) {
        if (quiz) {
            quiz.title = quiz.name + " - Quizicle"
            quiz.creation_date = getMonthYear(quiz.creation_date)

            res.status(200).render('quiz', {
                quiz: quiz,
                title: quiz.name + " - Quizicle",
                scripts: [
                    {file_name: "/search.js"},
                    {file_name: "/practice.js"}
                ]
            })
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
                query: searchTerm,
                scripts: [
                    {file_name: "/search.js"}
                ]
            })
        }
        else{
            res.status(404).render('results', {
                title: "No Results",
                no_result: 1,
                query: searchTerm,
                scripts: [
                    {file_name: "/search.js"},
                ]
            });

        }
    })

})

app.get('/create', function(req, res, next) {
    res.status(200).render('editQuiz', {
        title: 'Create a Quiz — Quizicle',
        scripts: [
            {file_name: "/search.js"},
            {file_name: "/create.js"},
            {file_name: "/newCardTemplate.js"}
        ]
    });
});

///SECTION: API Functions

app.post('/api/create', function(req, res, next) {
    console.log(req.body);

    var quiz = req.body

    console.log(quiz);

    // Check name and cards fields exist.
    if (quiz && quiz.name && quiz.cards) {
        // Check name non-empty cards length non-zero.
        if (quiz.name.replace(/ /g, '').length !== 0 && quiz.cards.length > 0) {
            // Check every card has prompt and answer.
            for (index = 0; index < quiz.cards.length; index++) {
                if (!quiz.cards[index].prompt || quiz.cards[index].prompt.replace(/ /g, '').length == 0 ||
                    !quiz.cards[index].answer || quiz.cards[index].answer.replace(/ /g, '').length == 0) {
                    res.status(400).send({
                        error: "Some cards missing prompts/answers."
                    })
                }
            }

            // Add a blank description if none exists or if all spaces.
            if (!quiz.description || quiz.description.replace(/ /g, '').length === 0) {
                quiz.description = ""
            }

            // Add empty tags array if none exists or if all spaces.
            if (!quiz.tags || quiz.tags.length === 0) {
                quiz.tags = []
            } else {
                // Check every tag has text.
                for (index = quiz.tags.length - 1; index > 0; index--) {
                    if (quiz.tags[index].replace(/ /g, '').length === 0) {
                        res.status(400).send({
                            error: "Some tags empty."
                        })
                    }
                }
            }

            // Server handles meta-data and db information
            quiz.creation_date = String(Math.round(+new Date()/1000))
            quiz.card_count = String(quiz.cards.length)
            // getNextQuizID(function(err, newID) {
            //     if (err) {
            //         res.status(500).send({
            //             error: "Failed to create id."
            //         })
            //     }

            //     quiz._id = String(newID)

            //     addQuiz(quiz, function(err, result) {
            //         if (err) {
            //             res.status(500).send({
            //                 error: "Failed to write to database."
            //             })
            //         }

            //         res.status(200).send(JSON.stringify({
            //             message: "Quiz successfully added",
            //             newID: String(newID)
            //         }))

            //         listDatabaseEntries()
            //     })
            // })

        } else {
            res.status(400).send({
                error: "Required fields empty."
            })
        }
    } else {
        res.status(400).send({
            error: "Request missing required fields."
        })
    }
})

app.get('*', function(req, res) {
  res.status(404).render('404', {
      title: 'Oops!',
      scripts: [
          {file_name: "/search.js"},
      ]
  })
})


app.listen(port, function() {
    console.log("🤖 Server is listening on port", port, "...\n")
})


/// MARK: ☁️ Mongo Database for the Quizicle website - - - - - - - - - - - - -

// var MongoClient = require('mongodb').MongoClient
// var database
// const quizCollection = 'quizzes'
// const sequenceCollection = 'sequence'
// const quizSequence = 'quiz_ID'

// // Set up Mongo DB parameters
// var mongoDBHost = process.env.MONGODB_HOST
// // Check if a port is specified, else default to the standard port
// var mongoDBPort = process.env.MONGODB_PORT || 27017
// var mongoDBUser = process.env.MONGODB_USER
// var mongoDBPass = process.env.MONGODB_PASS
// var mongoDBName = process.env.MONGODB_NAME

// var mongoDBURL = 'mongodb://' + mongoDBUser + ':' + mongoDBPass + '@' +
//     mongoDBHost + ':' + mongoDBPort + '/' + mongoDBName

// MongoClient.connect(mongoDBURL, function(err, client) {
//     if (err) {
//         throw err
//     }

//     // Set a gloabl variable so it can be used by the whole middleware stack.
//     database = client.db(mongoDBName)
//     console.log("☁️  Connected to database.")

//     startServer()

//     database.collection(quizCollection).createIndex({
//         name: "text",
//         description: "text",
//         tags: "text"
//     })

//     // Change this to `true` to clear the db and seed fresh from json.
//     if (false) seedDatabaseFromJSON('./exampleQuizzes.json', function() {
//         listDatabaseEntries()
//     })

//     // Start database from scratch.
//     if (false) resetDatabase(function() {
//         listDatabaseEntries()
//     })

//     // Change this to backup db. Do not use nodemon.
//     if (false) backupDatabaseToJSON()
// })

// ///SECTION: DB API functions

// // Returns the json of the quiz with the given id.
// async function lookupQuiz(quizID, completion) {
//     var query = { _id: quizID }
//     database.collection(quizCollection).find(query).toArray(function(err, result) {
//         if (err) throw err;

//         completion(result[0])
//     });
// }

// // Writes new quiz to db.
// async function addQuiz(quiz, completion) {
//     database.collection(quizCollection).insertOne(quiz, function(err, result) {
//         if (completion) {
//             completion(err, result)
//         }
//     })
// }

// //description tags name
// async function searchCollection(searchTerm, completion) {
//     var query = searchTerm.split('+').join(' ');

//     database.collection(quizCollection).find({$text: {$search: query}}).toArray(function(err, result) {
//         if (err) throw err;

//         completion(result);
//     });
// }

// // Returns an array of the <count> most recent quizzes.
// // - count: Int, max number of quizzes to get.
// async function lookupRecentQuizzes(count, completion) {
//     var numberOfResults = parseInt(count)
//     var sorting = { creation_date: -1 }
//     database.collection(quizCollection).find().sort(sorting).toArray(function(err, result) {
//         if (err) throw err

//         // Get readable dates
//         result.forEach(function(item, index) {
//             item.creation_date = getMonthYear(item.creation_date)
//         })

//         completion(result.slice(0, numberOfResults))
//     })
// }

// ///SECTION: DB utility functions

// // Backs up database to a JSON file with name backup<date>.json.
// // ⚠️ Don't run in nodemon or it will cycle forever!
// function backupDatabaseToJSON() {
//     console.log("💾  Backing up database...");

//     database.collection(quizCollection).find({}).toArray(function(err, allQuizzes) {
//         if (err) throw err

//         var today = new Date();
//         var date = today.toISOString().substring(0, 10);

//         var fileName = "./backup" + date + ".json"
//         var fileContents = JSON.stringify(allQuizzes, null, " ");

//         fs.writeFile(fileName, fileContents, (err) => {
//             if (err) throw err

//             console.log("💾  Back up complete.");
//         });
//     })
// }

// function seedDatabaseFromJSON(filePath, completion) {
//     console.log("⚠️  Seeding database from " + filePath);

//     var quizzes = require(filePath)

//     cleanUp(quizCollection, function() {
//         createCollection(quizCollection, function() {
//             database.collection(quizCollection).insertMany(quizzes)

//             // Start the quiz id counter at the last seed quiz
//             resetIDs(quizzes.length + 1, function() {
//                 if (completion) {
//                     completion()
//                 }
//             })
//         })
//     })
// }

// function resetDatabase(completion) {
//     console.log("⚠️  Resetting database...");


//     cleanUp(quizCollection, function() {
//         createCollection(quizCollection, function() {
//             // Start the quiz id counter at 1
//             resetIDs(1, function() {
//                 if (completion) {
//                     completion()
//                 }
//             })
//         })
//     })
// }

// function resetIDs(start, completion) {
//     cleanUp(sequenceCollection, function() {
//         createCollection(sequenceCollection, function() {
//             var sequenceBase = {
//                 _id: quizSequence,
//                 sequence_value: start
//             }

//             database.collection(sequenceCollection).insertOne(sequenceBase)

//             if (completion) {
//                 completion()
//             }
//         })
//     })
// }

// function getNextQuizID(completion) {
//     database.collection(sequenceCollection).findOneAndUpdate(
//         { _id: quizSequence },
//         { $inc: { sequence_value: 1 }},
//         function (err, data) {

//             completion(err, data.value.sequence_value)
//         })
// }

// function listDatabaseEntries() {
//     console.log("Collections: - - - - - - - - - - - - - - - - - - - -");
//     listAllCollections()

//     database.collection(quizCollection).find({}).toArray(function(err, result) {
//         console.log("Quizzes: - - - - - - - - - - - - - - - - - - - -");
//         console.log(result)
//     })

//     database.collection(sequenceCollection).find({}).toArray(function(err, result) {
//         console.log("Sequence: - - - - - - - - - - - - - - - - - - - -");
//         console.log(result)
//     })
// }

// function listAllCollections(completion) {
//     database.listCollections().toArray(function(err, collInfos) {
//         if (err) throw err

//         console.log(collInfos)
//         if (completion) {
//             completion()
//         }
//     })
// }

// function createCollection(collectionName, completion) {
//     database.createCollection(collectionName, function(err, result) {
//         if (err) throw err

//         if (completion) {
//             completion()
//         }
//     })
// }

// // Drops collection table if it exists
// function cleanUp(collectionName, completion) {
//     database.listCollections().toArray(function(err, result) {
//         if (err) throw err
//         var deleting = false

//         result.forEach(result => {
//             if (result.name == collectionName) {
//                 deleting = true
//                 deleteCollection(collectionName, function() {
//                     completion()
//                 })
//             }
//         })

//         if (!deleting) completion()
//     })
// }

// function deleteCollection(collectionName, completion) {
//     database.collection(collectionName).drop(function(err, delOK) {
//         if (err) throw err

//         if (completion) {
//             completion()
//         }
//     })
// }

///MARK: General utility functions

function getMonthYear(timestamp) {
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']

    var date = new Date(timestamp * 1000)

    var year = date.getFullYear()
    var month = months[date.getMonth()]

    return(month + " " + year)
}
