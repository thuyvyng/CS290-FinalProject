

function add_card_code(){
    var new_card_template = Handlebars.templates.newCard;
	
    var cardContainer = document.querySelector('.photo-card-container');
    cardContainer.insertAdjacentHTML('beforeend', cardContainer);
}

function delete_card_code(event){
    var deleted_card = event.target;
    deleted_card.parentNode.remove();
    /*var cardContainer = document.querySelector('.photo-card-container');*/

}

window.addEventListener('DOMContentLoader', function (){
	
    var add_card_button = document.getElementById('add_button');
    if (add_card_button){
        add_card_button.addEventListener('click', add_card_code);
    }
	
    var remove_card_button = document.getElementByClassName('remove_card_button');
    for(var i = 0; i < remove_card_button.length; i++){
	remove_card_button[i].addEventListener('click', delete_card_code);
    }
});
