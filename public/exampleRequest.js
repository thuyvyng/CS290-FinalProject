var request = new XMLHttpRequest()

var url = "/api/create"
request.open('POST', url)

var quiz = {
    name: "French Vocab",
    cards: [{
        prompt: "Bonjour",
        answer: "Hello"
    }]
}

// All that is required for a request is name, and at least one card.
// If any field is only spaces the server will return a 400 and describe
// what's missing.
// If the DB craps out, the server will return a 500, and an alert should be shown.
// If the quiz is legit, the server will return an object with the _id of the new
// quiz, which should be used to open the quiz page for that quiz.

var requestBody = JSON.stringify(quiz);

request.addEventListener('load', function(event) {
    if (event.target.status === 200) {
        console.log("success");
    }

    console.log(JSON.parse(request.responseText))
});

request.setRequestHeader('Content-Type', 'application/json');
request.send(requestBody);
