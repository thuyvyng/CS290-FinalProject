var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('change', search);
function search(event){
    if(search_box.value.replace(/\s+/g, '').length!=0){
        var url='/search/'+search_box.value.replace(/\s+/g, '+');
        console.log('URL requested:', url);
        search_box.value='';
        window.location.assign(url);
    }
}
var titles=document.getElementsByClassName("quiz_title");
for(var i=0;i<titles.length;i++){
    titles[i].addEventListener('click', quiz_handle);
}
var tags=document.getElementsByClassName("tags");
for(var i=0;i<tags.length;i++){
    tags[i].addEventListener('click', click_handle);
}
function click_handle(event){
    var url='/search/'+event.target.textContent.replace('#', '');
    window.location.assign(url);
}
function quiz_handle(event){
    var url='/quiz/'+event.target.parentNode.querySelector("#ID").textContent;
    window.location.assign(url);
}