var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('change', search);

function search(event){
    var url='/search/'+search_box.value.replace(/\s+/g, '').toLowerCase();
    console.log('URL requested:', url);
    search_box.value='';
    window.location.assign(url);
}
