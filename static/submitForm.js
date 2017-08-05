new Image().src = "loading.gif";

var form = document.getElementById('future-devops');
form.addEventListener('submit', function(event) {
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
        document.getElementById("loading").innerHTML = '';
        if (xhr.status != 200) {
            var res = 'Error ' + xhr.status + ': ' + xhr.statusText;
        } else {
            var res = xhr.responseText;
        }
        document.getElementById("result").innerHTML = res;
        }
    }

    document.getElementById("tools").className = 'hidden';
    document.getElementById("emails").className = 'hidden';
    document.getElementById("loading").innerHTML = '<img src="loading.gif" />';

    xhr.open('POST', 'http://127.0.0.1:8000/levenstein', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(json);
});