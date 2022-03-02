var written = "<p class='terminal-title'>MRZTTI.</p><p>Welcome to my website...</p>";
var buffer = "";
var in_symbol = "> ";
var available_commands =
    [
        "<div class='ok'>help</div> -> Display help",
        "<div class='ok'>ls</div> - Show web tree",
        "<div class='ok'>whoami</div> - Who are you?",
        "<div class='ok'>projects</div> - See all my projects",
        "<div class='ok'>contact</div> - Get in touch with me",
        "<div class='ok'>launch</div> - Launch a specific project"
    ];

function cmd(c){
    if (c == "help"){
        return "<div class='warning text-center wide'> --==-- Available commands: --==--</div> <ul class='list-group list-group-flush faded'> <li class='list-group-item'>" + available_commands.join("</li><li class='list-group-item'>") + "</li></ul>";
    }
    if (c == "ls"){
        return "You found help"
    }
    if (c == "whoami"){
        return "Sorry, I can't help you with these philosophical questions!"
    }
    if (c == "projects"){
        return "You found help"
    }
    if (c == "reset" || c == "clear" || c == "reload"){
        location.reload();
        return ""
    }
    else{
        return "<div class='warning'> Command unrecognized. <div class='warning faded'>(try typing 'help')</div></div>";
    }

}

$(document).ready(function() {
    $('#output').html(written);
    //$('#input').append(in_symbol);
});


$('#output').on('keypressed',function(key) {
    //Catch return
    if(key.which == 13) {
        
    } else {
        $('#output').append(document.createTextNode(String.fromCharCode(key.which)));
    }

});


$(function() {
    var whitelist = [
        32, 50, 49, 51, 52, 53, 54, 56, 57, 48, 45, 61, 91, 93, 92, 59, 44, 46, 47, 109, 192, 173, 189
    ]
    
    var _to_ascii = {
        '188': '44',
        '109': '45',
        '190': '46',
        '191': '47',
        '192': '96',
        '220': '92',
        '222': '39',
        '221': '93',
        '219': '91',
        '173': '45',
        '187': '61', //IE Key codes
        '186': '59', //IE Key codes
        '189': '45'  //IE Key codes
    }

    var shiftUps = {
        "96": "~",
        "49": "!",
        "50": "@",
        "51": "#",
        "52": "$",
        "53": "%",
        "54": "^",
        "55": "&",
        "56": "*",
        "57": "(",
        "48": ")",
        "45": "_",
        "61": "+",
        "91": "{",
        "93": "}",
        "92": "|",
        "59": ":",
        "39": "\"",
        "44": "<",
        "46": ">",
        "47": "?"
    };

    $(document).on('keydown', function(e) {
        var c = e.which;
        //Catch return
        if(e.which == 13) {
            $('#output').append(in_symbol);
            $('#output').append(document.createTextNode(buffer));
            $('#output').append("<br>");
            $('#output').append(cmd(buffer));
            $('#output').append("<br>");

            buffer = "";
            $('#input').html(buffer);
            var scrollingElement = (document.scrollingElement || document.body);
            scrollingElement.scrollTop = scrollingElement.scrollHeight;
            $('#output').focus();

        }
        // Back
        else if(e.which == 8){
            if (buffer.length > 0){
                buffer = buffer.slice(0, -1);
                $('#input').html(document.createTextNode(buffer));
            }
        }
        // arrow right
        else if(e.which == 39){
             
        }
        // arrow left
        else if(e.which == 39){
             
        }  
        else if(whitelist.includes(e.which) || (e.which >= 65 && e.which <= 90)){
            //alert(e.which);
            //normalize keyCode 
            if (_to_ascii.hasOwnProperty(c)) {
                c = _to_ascii[c];
            }

            if (!e.shiftKey && (c >= 65 && c <= 90)) {
                c = String.fromCharCode(c + 32);
            } else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
                //get shifted keyCode value
                c = shiftUps[c];
            } else {
                c = String.fromCharCode(c);
            }
            $('#input').append(document.createTextNode(c));
            buffer = buffer + c;
        }
    });    
});


function mobileOpenKB(){
    $("#hiddenTextInput").focus();
}