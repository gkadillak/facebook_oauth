$(function() {

    var _findIntent = {};
    var _dataType = {};
    var $row = $('.row');
    var baseUrl = 'http://localhost:8000';

    _dataType.photo = function(photoObj){
        if (!photoObj.message){
            photoObj.message = '';
        }
        $row.append(photoTile(photoObj));
    };

    _dataType.link = function(linkObj){
        linkTile(linkObj);
    };

    _dataType.status = function(statusObj) {
        console.log('Status', statusObj);
    };

    _dataType.video = function(videoObj){
        console.log('Video', videoObj);
    };

    _findIntent.get_feed = function() {
        $.ajax({
            url: baseUrl + "/get_feed",
            dataType: "json" // jsonp won't work with promises
        }).then(function (data) {
            feedLoaded(data);
            _findIntent.nextUrl = data.paging.next;
        }).fail(function(error){
            alert('There has been an error:', error);
        });
    };

    _findIntent.show_profile = function(){
        $.ajax({
            url: baseUrl + '/get_profile',
            dataType: 'json'
        }).then(function(data){
            feedLoaded(data);
        }).fail(function(error){
           alert('Error with show profile:', error);
        });
    };

    _findIntent.get_next = function(){
        $.ajax({
            url: _findIntent.nextUrl,
            dataType: 'jsonp'
        }).then(function(data){
            console.log(data);
        }).fail(function(error){
           console.log('Error with get next:', error);
        });
    };

    function feedLoaded(response){
        response.data.forEach(function(item){
            _dataType[item.type](item);
        });
    }

    var photoTile = function(src){
        return '<div class="item">' +
            '<div class="well">' +
                '<img src="' + src.picture + '" />' +
                '<p>' + src.message + '</p>' +
            '</div>' +
        '</div>'
    };

    var linkTile = function(link){
        return '<div class="item">' +
            '<div class="well">' +
                '<a href="' + link.link + '">' + link.message + '</a>' +
            '</div>' +
        '</div>'
    };

    var statusTile = function(status){
        return '<div class="item">' +
            '<div class="well">' +
                '<h1>' + link.link + '">' + link.message + '</a>' +
            '</div>' +
        '</div>'
    };


    _findIntent.get_feed(); // Get user's feed upon page load
    console.log(_findIntent.nextUrl);
    // Take in microphone audio, translate to intent string and pull out


    var mic = new Wit.Microphone(document.getElementById("microphone"));
    var info = function (msg) {
        document.getElementById("info").innerHTML = msg;
    };
    var error = function (msg) {
        document.getElementById("error").innerHTML = msg;
    };
    mic.onready = function () {
        info("");
    };
    mic.onaudiostart = function () {
        info("");
        error("");
    };

    mic.onaudioend = function () {
        info("");
    };

    mic.onresult = function (intent, entities) {
        var resultObj = {};
        resultObj['intent'] = voice_string("intent", intent)[1];


        for (var key in entities) {
            var entity = entities[key];


            if (!(entity instanceof Array)) {
                resultObj[voice_string(key, entity.value)[0]] = voice_string(key, entity.value)[1];
            } else {
                for (var i = 0; i < entity.length; i++) {
                    resultObj[voice_string(key, entity[i].value)[0]] = voice_string(key, entity[i].value)[1];
                }
            }
        }

        // Put the voice results in a global variable
        currentSearch = resultObj;


        };
        mic.onerror = function (err) {
            error("Error: " + err);
        };
        mic.onconnecting = function () {
            info("Microphone is connecting");
        };
        mic.ondisconnected = function () {
            info("Microphone is not connected");
        };

        mic.connect('7Q3QCU74BR4O2A6ERD4YZAL4VM3BXLLE');

        function voice_string(key, value) {
            if (toString.call(value) !== "[object String]") {
                value = JSON.stringify(value);
            }
            return [key, value];
        }

}());