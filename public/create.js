function add_card_code() {

    console.log("Add");

    var newObject = {
        prompt: "Prompt...",
        answer: "Answer..."
    }
    var new_card_template = Handlebars.templates.newCard(newObject);
    console.log("got template ", new_card_template);

    var addButton = document.getElementsByClassName('create_new_card')[0];
    addButton.insertAdjacentHTML('beforebegin', new_card_template);
}

function delete_card_code(child) {
    if (document.getElementsByClassName('edit_card').length > 1) {
        child.parentNode.remove();
    }
}

function finish_card() {
    var quiz = new Object()

    var title = document.getElementsByClassName('edit_quiz_title')[0].value
    if (!title) {
        // ALERT
        return
    }

    quiz.name = title

    quiz.cards = []

    var cards = document.getElementsByClassName('edit_card')
    for (index = 0; index < cards.length; index++) {
        var prompt = cards[index].childNodes[3].value
        var answer = cards[index].childNodes[5].value
        if (!prompt || !answer) {
            // ALERT
            return
        }

        var card = new Object()
        card.prompt = prompt
        card.answer = answer
        quiz.cards.push(card)
    }

    // All required fields met ✅

    var description = document.getElementsByClassName('edit_quiz_description')[0].value;
    quiz.description = description

    quiz.tags = [];

    var tags = document.getElementsByClassName('edit_quiz_tags')[0].value.split(' ');
    tags.forEach(function(item, index) {
        quiz.tags.push(item)
    })

    console.log(quiz);

    var request = new XMLHttpRequest();
    var requestURL = '/api/create';
    request.open('POST', requestURL);

    var requestBody = JSON.stringify(quiz);

    request.addEventListener('load', function(event) {
        console.log(event.target.status)
        console.log(JSON.parse(request.responseText));
        if (event.target.status !== 200) {
            var message = event.target.response;
            alert("Server error: " + message);
        }
    });

    request.setRequestHeader('Content-Type', 'application/json')
    request.send(requestBody)
}

function cancel_card() {
    console.log('In canceling process');
    var confirm_cancel = confirm("Are you sure you want to cancel this quiz?");
    if (confirm_cancel) {
        console.log("wanted to cancel");
    }
}

window.addEventListener('DOMContentLoaded', function() {
    var add_card_button = document.getElementById('add_button');

    if (add_card_button) {
        add_card_button.addEventListener('click', add_card_code);
    }

    var done_button = document.getElementById('done_button');

    if (done_button) {
        done_button.addEventListener('click', finish_card);
    }

    var cancel_button = document.getElementById('cancel_button');

    if (cancel_button) {
        cancel_button.addEventListener('click', cancel_card);
    }
});
