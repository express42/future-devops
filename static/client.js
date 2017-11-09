String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

function count_lines(col) {
    count = document.getElementById(col).value.lineCount();
    document.getElementById(col + "-header").innerHTML = col + ': ' + count;
}

function obfuscate(email) {
    [name, domain] = email.split('@');
    name = name[0] + '*'.repeat(name.length - 1)
    return name + '@' + domain;
}
count_lines("Emails");
count_lines("Tools");

var form = document.getElementById('future-devops');
form.addEventListener('submit', function(event) {
    document.getElementById("result").innerHTML = '';
    event.preventDefault();
    var result = {};

    result["emails"] = document.getElementById("Emails").value.lines();
    result["tools"] = document.getElementById("Tools").value.lines();
    var json = JSON.stringify(result);

    var xhr = new XMLHttpRequest();
    document.getElementById("loading").style.display = "block";
    hide_input();

    xhr.open('POST', '/levenstein', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(json);
    
    poll(
    function() {
        var status = new XMLHttpRequest();
        var res = '';
        status.onreadystatechange=function() {
            if (status.readyState==4) {
                if (status.status != 200) {
                    res = 'Error ' + status.status + ': ' + status.statusText;
                } else {
                    res = parse_status(JSON.parse(status.responseText));
                }
                document.getElementById("result").innerHTML = res[1];
            }
        }
        status.open('GET', '/levenstein', false);
        status.send();

        return res[0];
    },
    function() {
        document.getElementById("loading").style.display = "none";
    },
    function() {
        // Error, failure callback
    },
    36000000,
    200
)
});

function hide_input() {
    document.getElementById("Tools").classList.add('hidden');
    document.getElementById("Emails-container").classList.add('hidden');
}
function reveal_input() {
    document.getElementById("Tools").classList.remove('hidden');
    document.getElementById("Emails-container").classList.remove('hidden');
}

function parse_status(status) {
    var res = '';
    var iter = 0;
    var found = false;
    for (var step of status) {
        if (step["winners"].length == 0
            && step["likely_winners"].length == 0 ) {
            res += 'Checked ' + step["emails_checked"] + ' emails.'
            + ' Looking for ' + step["needed"] + ' winners<br>';
        } else if (step["needed"] == 0 ) {
            found = true;
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
    return [found, res];
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

function poll(fn, callback, errback, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() {
            // If the condition is met, we're done! 
            if(fn()) {
                callback();
            }
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) {
                setTimeout(p, interval);
            }
            // Didn't match and too much time, reject!
            else {
                errback(new Error('timed out for ' + fn + ': ' + arguments));
            }
    })();
}

function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
        var r = new FileReader();
        r.onload = function(e) { 
            var contents = e.target.result.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"");
            document.getElementById("Emails").value = contents;
            var tmp = [];
            for (var line of document.getElementById("Emails").value.lines()) {
                tmp.push(obfuscate(line));
            }
            document.getElementById('Emails-text').innerHTML = tmp.join('<br>');
            count_lines("Emails");
        }
        r.readAsText(f);
        reveal_input();
    } else { 
        alert("Failed to load file");
    }
}
document.getElementById('files').addEventListener('change', readSingleFile, false);