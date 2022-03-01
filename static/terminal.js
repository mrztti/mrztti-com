$(document).keydown(function(key) {
    //Catch return
    if(key.which == 13) {
        alert('You pressed enter!');
    }
    if (key.which == 8) {

        // Filters out events coming from any of the following tags so Backspace
        // will work when typing text, but not take the page back otherwise.
        var rx = /INPUT|SELECT|TEXTAREA/i;
        if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
            e.preventDefault();
        }

        alert('backspace trapped');
     }

    $('#output').append(document.createTextNode(String.fromCharCode(key.which)));
});