function add_card_code(){

    console.log("Add");

    var new_card_template = Handlebars.templates.newCard;

    var cardContainer = document.querySelector('.photo-card-container');
    cardContainer.insertAdjacentHTML('beforeend', cardContainer);
}

function delete_card_code(event){
    console.log("delete");

    var deleted_card = event.target;

    console.log(deleted_card);

    deleted_card.parentNode.remove();
    /*var cardContainer = document.querySelector('.photo-card-container');*/

}


var add_card_button = document.getElementById('add_button');

if (add_card_button){
    add_card_button.addEventListener('click', add_card_code);
}

var remove_card_buttons = document.getElementsByClassName('remove_card_button');

console.log(remove_card_buttons);

for (var i = 0; i < remove_card_buttons.length; i++) {
    remove_card_buttons[i].addEventListener('click', delete_card_code)
}
