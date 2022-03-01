$(document).on('keypress',function(key) {
    //Catch return
    if(key.which == 13) {
        alert('You pressed enter!');
    }

    $('#output').append(document.createTextNode(String.fromCharCode(key.which)));
});