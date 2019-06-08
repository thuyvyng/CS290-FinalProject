var search_box = document.querySelector('#nav_search_box');
search_box.addEventListener('change', search);
function search(event){
   // searches = require('exampleQuiz.json');
    //for(var i=0;i<searches.length;i++){
     //   console.log(searches)
       // if((searches[i].name.includes(search_box.value))||(searches[i].description.includes(search_box.value))){
            //FIX ME//
            var url='/search/'+search_box.value.toLowerCase();
            console.log('===URL===', url);
            //res=new XMLHttpRequest();
            //res.open('GET', URL);
            //res.send(body);
            //return res.redirect(URL)
            window.location.replace(url);
        
    

}