var form = document.getElementById('future-devops');
form.addEventListener('submit', function(event) {
    document.getElementById("result").innerHTML = '';
    event.preventDefault();
    var formData = new FormData(form),
        result = {};

    for (var entry of formData.entries())
    {
        result[entry[0]] = entry[1].split('\r\n');
    }
    var json = JSON.stringify(result);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function() {
        if (xhr.readyState==4) {
            document.getElementById("loading").style.display = "none";
            if (xhr.status != 200) {
                var res = 'Error ' + xhr.status + ': ' + xhr.statusText;
            } else {
                var res = parse_status(JSON.parse(xhr.responseText));
            }
            document.getElementById("result").innerHTML = res;
        }
    }

    document.getElementById("loading").style.display = "block";
    hide_input();

    xhr.open('POST', '/levenstein', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(json);
});

function hide_input() {
    document.getElementById("tools").className = 'hidden';
    document.getElementById("emails").className = 'hidden';
}
function reveal_input() {
    document.getElementById("tools").className = '';
    document.getElementById("emails").className = '';
}

function parse_status(status) {
    var res = '';
    var iter = 0;
    for (var step of status) {
        if (step["winners"].length == 0
            && step["likely_winners"].length == 0 ) {
            res += 'Checked ' + step["emails_checked"] + ' emails.'
            + ' Looking for ' + step["needed"] + ' winners<br>';
        } else if (step["needed"] == 0 ) {
            res += 'Found winners:<br>' + print_winners(step["winners"]);
        } else {
            res += 'Iteration ' + iter + ':'
            if (step["winners"].length != 0 ) {
                res += ' Already found: ' + print_names(step["winners"]) + '.'
                + ' Need ' + step["needed"] + ' more.'
            }
            res += ' Looking among ' + print_names(step["likely_winners"]) + '.<br>';
        }
        iter++;
        res += '<br>';
    }
    return res;
}

function print_winners(lst) {
    var res = '';
    for (var el of lst) {
        res += '<span class="email">'+ el[1] + '</span>'
        + ' to ' + el[2] + ' just in ' + el[0] + ' steps.<br>';
    }
    return res;
}

function print_names(lst) {
    var res = [];
    for (var el of lst) {
        res.push('<span class="email">'+ el[1] + '</span>');
    }
    return res.join(', ');
}