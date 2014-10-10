var currentSearch = {};
var currentFBResults = {};

    // Function to call facebook and
    window.fbAsyncInit = function () {
        FB.init({
            appId: '779403745457956',
            xfbml: true,
            cookie: true,
            version: 'v2.1'
        });

        FB.login(function (response) {}, {scope: 'user_friends, publish_actions, read_stream'});


        }; //AsyncInit

    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    function facebookInit(intent) {
        // "POST {message body}"
        if (intent === 'post') {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api(
                        "/me/feed",
                        "POST",
                        {"message": currentSearch.message_body},

                        function (response) {
                            console.log(response);
                            if (response && !response.error) {
                                console.log('SUCCESS!!!');
                                console.log(response);
                                console.log(currentSearch);
                                console.log(currentFBResults);
                            }
                        }
                    );
                }
            });
        }

        // "WHAT IS MY LAST NAME"
        if (intent === 'get_lastname') {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api(
                        '/me',
                        function (response) {
                            currentFBResults = response;
                            console.log(response);
                            $('#displaymessage').html('Hello Mr. ' + response.last_name + '. How are you today?');
                        });
                }
            });
        } //lastname check

        if (intent === 'get_feed') {
            FB.getLoginStatus(function (response){
               FB.api(
                    '/me/home',
                   function (response){
                       console.log(response);
                       for (var i = 0; i < response.data.length; i++) {
                           $('#feedList').append('<li>' + response.data[i].name + '</li>');
                           $('#feedList').append('<img src="' + response.data[i].picture + '">');
                       }
                   }
               )
            });
        } // home page of facebook
    }


    function initialize() {
        var map_canvas = document.getElementById('map_canvas');
        var map_options = {
            center: new google.maps.LatLng(39.50, -98.35),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(map_canvas, map_options);

        for (var i = 0; i < photoData.length; i++) {
            var photo = photoData[i];
            if (photo.place != undefined && photo.name != undefined) {
                addMarker(photo, map, i);
            }
        }
    }

    var markers = [];
    var infoWindows = [];

    // Google maps w/ facebook pictures geographically
    function addMarker(photo, map, counter) {
        var myLatLng = new google.maps.LatLng(photo.place.location.latitude,
            photo.place.location.longitude);

        var image = {
            url: photo.url,
            scaledSize: new google.maps.Size(200, 200),

        };
        infoWindows[counter] = new google.maps.InfoWindow({
            content: '<img style="width: 100; height: 100" src="' + photo.source + '"/><br><p>' + photo.name + '</p>'

        });

        markers[counter] = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: photo.name,
            infoWindow: infoWindows[counter],

        });

        google.maps.event.addListener(markers[counter], 'click', function () {
            this.infoWindow.open(map, this);

        })
    }


    var mic = new Wit.Microphone(document.getElementById("microphone"));
    var info = function (msg) {
        document.getElementById("info").innerHTML = msg;
    };
    var error = function (msg) {
        document.getElementById("error").innerHTML = msg;
    };
    mic.onready = function () {
        info("Microphone is ready to record");
    };
    mic.onaudiostart = function () {
        info("Recording started");
        error("");
    };
    mic.onaudioend = function () {
        info("Recording stopped, processing started");
    };

    mic.onresult = function (intent, entities) {
        var resultObj = {};
        resultObj['intent'] = voice_string("intent", intent)[1];


        for (var key in entities) {
            var entity = entities[key];


            if (!(entity instanceof Array)) {
                resultObj[voice_string(key, entity.value)[0]] = voice_string(key, entity.value)[1];
                console.log(resultObj);


            } else {
                for (var i = 0; i < entity.length; i++) {
                    resultObj[voice_string(key, entity[i].value)[0]] = voice_string(key, entity[i].value)[1];
                    console.log(resultObj);
                }
            }
        }

        if (resultObj.intent === 'get_pictures') {
            initialize();
        }
        currentSearch = resultObj;
        console.log("POST BODY: " + currentSearch.message_body);
        facebookInit(currentSearch.intent);


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
//      mic.start();
//      mic.stop();

    function voice_string(key, value) {
        if (toString.call(value) !== "[object String]") {
            value = JSON.stringify(value);
        }
        return [key, value];
    }

// https://github.com/kswedberg/jquery-smooth-scroll
$('#scroll').on('click', function () {
    $.smoothScroll(200);

});

$('.getOut').on('click', function(){
    $(this).parent().parent().parent().hide(400);
});
