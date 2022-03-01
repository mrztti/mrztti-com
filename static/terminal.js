$(document).on('keydown',function(key) {
    //Catch return
    if(key.which == 13) {
        alert('You pressed enter!');
    }
    if(key.which == 8){
        alert('backspace trapped');
    }
});

$(document).on('keypressed',function(key) {
    //Catch return
    if(key.which == 13) {
        
    } else {
        $('#output').append(document.createTextNode(String.fromCharCode(key.which)));
    }

});

