var written = "<h1>HELLO!</h1>";
var buffer = "";
var in_symbol = "<br>> ";

function cmd(c){
    if (c == "help"){
        return "You found help"
    }
    if (c == "projects"){
        return "You found help"
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
        32, 50, 49, 51, 52, 53, 54, 55, 56, 57, 48, 45, 61, 91, 93, 92, 59, 44, 46, 47,
        188, 109, 190, 191, 192, 220, 222, 221, 219, 173, 187, 186, 189
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
