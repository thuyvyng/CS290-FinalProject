function add_card_code(){

    console.log("Add");

    var newObject = {
	prompt: "Prompt...",
	answer: "Answer..."
    }
    var new_card_template = Handlebars.templates.newCard(newObject);
    console.log("got template ", new_card_template);
    var cardContainer = document.querySelector('.complete_container');
    cardContainer.insertAdjacentHTML('beforeend', new_card_template);
}

function delete_card_code(child){
    console.log("delete");

    //var deleted_card = event.target;

    //console.log(deleted_card);
    console.log('this: ', child);
    child.parentNode.remove();
    /*var cardContainer = document.querySelector('.photo-card-container');*/

}

function finish_card(res){
    console.log('In finishing process');
    var title = document.getElementsByClassName('edit_quiz_title');
	title = title[0].value;
    var inputs = document.getElementsByClassName('edit_card_input');
	input_1 = inputs[0].value;
	input_2 = inputs[1].value;
    console.log("title: ", title);
	console.log("pro: ", input_1);
	console.log("ans: ", input_2);
    if (title && input_1 && input_2){
	console.log("made it in");
	var request = new XMLHttpRequest();
	var requestURL = '/api/create';
	request.open('POST', requestURL);

	var title_str = document.getElementsByClassName('edit_quiz_title');
	title_str = title_str[0].value;
	console.log('title: ', title_str);

	var desc_str = document.getElementsByClassName('edit_quiz_description');
	desc_str = desc_str[0].value;
	console.log('description: ', desc_str);

	var tagsArr = []; 
	var tags_len = document.getElementsByClassName('edit_quiz_tags');
	for (var i = 0; i < tags_len; i++){
		var tags_val = tags_len[i].value;
		tagsArr.push(tags_val);
	}
	console.log('tags: ', tagsArr);

	var cardsArr = [[]];
	var cards_len = document.getElementsByClassName("edit_card_input");
	for (var i = 0; i < cards_len; i++){
	    cardsArr
	}
	/*var quiz = {
	    id: 0, 
	    title: title_str,
	    description: desc_str,
	    tags: tagsArr,
	    cards: [

	    ]
	}
	*/

	var requestBody = JSON.stringify(quiz);
	
	request.addEventListener('load', function(event) {
	    console.log(event.target.status);i
	    console.log(JSON.parse(request.responseText));
	    if(event.target.status !== 200){
		var message = event.target.response;
	        res.status(500).alert("Error storing quiz in the database: " + message);
	    }
	});
	
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(requestBody);
    }
    else{
        if(!title){
	    res.status(400).send("A title is required.");
	}
        else{
	    res.status(400).send("Both the Prompt and Answer must be filled out in the first card.");
	}
    }
}

function cancel_card(){
    console.log('In canceling process');
    var confirm_cancel = confirm("Are you sure you want to cancel this quiz?");
    if (confirm_cancel){
        console.log("wanted to cancel");
    }
}

window.addEventListener('DOMContentLoaded', function(){
    var add_card_button = document.getElementById('add_button');

    if (add_card_button){
        add_card_button.addEventListener('click', add_card_code);
    }

/*
var remove_card_buttons = document.getElementsByClassName('remove_card_button');
console.log(remove_card_buttons);

for (var i = 0; i < remove_card_buttons.length; i++) {
    remove_card_buttons[i].addEventListener('click', delete_card_code)
}
*/

    var done_button = document.getElementById('done_button');

    if (done_button){
        done_button.addEventListener('click', finish_card);
    }

    var cancel_button = document.getElementById('cancel_button');

    if(cancel_button){
        cancel_button.addEventListener('click', cancel_card);
    }
});
