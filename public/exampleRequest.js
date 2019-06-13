var request = new XMLHttpRequest()

var url = "/api/create"
request.open('POST', url)

var quiz = {
    name: "French Vocab from FR 101 Midterm with Dr. Pierre Study Set",
    description: "   ",
    tags: [],
    cards: [{
        prompt: "Bonjour",
        answer: "Hello"
    }, {
        prompt: "Au revoir",
        answer: "Good bye"
    }]
}

var requestBody = JSON.stringify(quiz);

request.addEventListener('load', function(event) {
    console.log(event.target.status)
    console.log(JSON.parse(request.responseText))
});

request.setRequestHeader('Content-Type', 'application/json');
request.send(requestBody);
