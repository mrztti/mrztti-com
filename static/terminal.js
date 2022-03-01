$(document).on('keydown',function(key) {
    if(key.which == 13) {
        alert('You pressed enter!');
    }
    else if(key.which == 8){
        alert('backspace trapped');
    }
}).on('keypressed',function(key) {
    //Catch return
    if(key.which == 13) {
        
    } else {
        $('#output').append(document.createTextNode(String.fromCharCode(key.which)));
    }

});
