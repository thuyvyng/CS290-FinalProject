var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('change', search);
function search(event){
    var url='/search/'+search_box.value.replace(/\s+/g, '').toLowerCase();
    console.log('URL requested:', url);
    search_box.value='';
    window.location.assign(url);
}

//Practice Page Stuff
var current_card = 0;

function showPracticeModal(){
  var practiceContainer = document.getElementsByClassName('practice_quiz_container')[0];
  var practiceCard = document.getElementsByClassName('practice_card')[0];

  practiceContainer.classList.remove('hidden');
  practiceCard.classList.remove('hidden');

  current_card +=1;
  document.getElementById("current_card").innerHTML = current_card.toString();

}

function hidePracticeModal(){
  var practiceContainer = document.getElementsByClassName('practice_quiz_container')[0];
  var practiceCard = document.getElementsByClassName('practice_card')[0];

  practiceContainer.classList.add('hidden');
  practiceCard.classList.add('hidden');
}
