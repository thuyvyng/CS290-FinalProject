//Practice Page Stuff
var current_card = 0;
var counter = 0;

var first_element = document.getElementsByClassName("practice_card")[current_card]
first_element.className = "practice_card"

// Modal

function togglePracticeModal() {
    var practiceContainer =  document.getElementsByClassName('practice_quiz_container')[0]
    practiceContainer.classList.toggle('hidden')

    counter = current_card +1;
    document.getElementById("current_card").innerHTML = counter.toString();

    var body = document.getElementsByTagName('body')[0]
    body.classList.toggle("no_scroll")
}

// Flipping

function flip() {
    var element = document.getElementsByClassName("practice_card")[current_card]
    element.classList.toggle("flipped")
}

// Sliding

function previous() {
    if (current_card > 0) {
        // Move current to next
        var current_element = document.getElementsByClassName("practice_card")[current_card]
        current_element.className = "practice_card off_right"

        // Move prev to current
        var prev_element = document.getElementsByClassName("practice_card")[current_card - 1]
        prev_element.className = "practice_card"

        current_card -= 1
        counter = current_card +1;
        document.getElementById("current_card").innerHTML = counter.toString()

    }
}

function next() {
    if (current_card < (document.getElementsByClassName("practice_card").length - 1)) {
        // Move current to prev
        var current_element = document.getElementsByClassName("practice_card")[current_card]
        current_element.className = "practice_card off_left"

        // Move next to current
        var next_element = document.getElementsByClassName("practice_card")[current_card + 1]
        next_element.className = "practice_card"

        current_card += 1
        counter = current_card +1;
        document.getElementById("current_card").innerHTML = counter.toString()
    }
}
