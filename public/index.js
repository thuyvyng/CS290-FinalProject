var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('input', search);
function search(event){
    searches = require('../exampleQuiz.json');
    for(var i=0;i<searches.length;i++){
        if((searches[i].name.includes(search_box.value)||(searches[i].description.includes(search_box.value))){
            
        }
    }

}