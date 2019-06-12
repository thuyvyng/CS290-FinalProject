var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('change', search);
function search(event){
    if(search_box.value.replace(/\+/g, '').length!=0){
        var url='/search/'+search_box.value.replace(/\s/g, '+');
        console.log('URL requested:', url);
        search_box.value='';
        window.location.assign(url);
    }
}
