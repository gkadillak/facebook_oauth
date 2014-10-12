var currentSearch = {};
var currentFBResults = {};
var tileObj = {};
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
        if (intent === 'like_post') {
            FB.getLoginStatus(function (response){
                if (response.status === 'connected') {
                    FB.api (
                        '/' + tileObj[currentSearch.number] + '/likes',
                        'POST',
                        function (response){
                            if (response && !response.error) {
                            console.log(response);
                          }
                        }
                    )
                }
            })
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
                           // Only get the 'photo' types
                           if (response.data[i].type === 'photo') {
                               var rawPic;
                               var message;
                               var avatar;
                               var author;
                               var postNumber;

                               if (response.data[i].picture.search('s130x130') > 0) {
                                   rawPic = response.data[i].picture.replace('/s130x130', '');
                               }
                               else  {
                                   rawPic = response.data[i].picture.replace('/p130x130', '');
                               }

                               var largePic = rawPic.replace('/v', '');

                               if (typeof response.data[i].message != 'undefined') {
                                   message = response.data[i].message
                               }

                               else{
                                   message = '';
                               }

                               // Avatar is the mini profile picture
                               avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                               author = response.data[i].from.name;
                               postNumber = i;

                               // Create the HTML styling and add to page
                               var frontTiles = imageTile(largePic, message, avatar, author, postNumber);
                               $('#frontTile').append(frontTiles);
                               // Add the object ID to a global object to be able to 'like' it later
                               tileObj[i] = response.data[i].id;

                           }

                           else if (response.data[i].type === 'status') {
                               var comment = response.data[i].message;
                               var avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                               var author = response.data[i].from.name;
                               var number = i;
                               var frontTiles = commentTile(comment, avatar, author, number);
                               $('#frontTile').append(frontTiles);

                               // Add the object ID to a global object to be able to 'like' it later
                               tileObj[i] = response.data[i].id;
                           }
                       }
                      console.log(tileObj);
                      console.log(currentSearch);
                   }
               )
            });
        } // home page of facebook
    }

// Tile creator functions
function imageTile(imageSrc, title, avatar, author, number) {

    return "<div class='col-sm-6 col-md-4'>" +
            "<div class='thumbnail'>" +
                "<p>" + number + "</p>" +
                "<p><img src='" + avatar +  "' />" + author+ "</p>" +
                "<img src='" + imageSrc + "' data-src='holder.js/300x300' alt='...'>" +
                "<div class='caption'>" +
                "<h3>" + title + "</h3>" +
            "</div>" +
            "</div>" +
        "</div>";
}

function commentTile(comment, avatar, author, number){
    return "<div class='col-sm-6 col-md-4'>" +
        "<div class='thumbnail'>" +
            "<p>" + number + "</p>" +
            "<p><img src='" + avatar +  "' />" + author+ "</p>" +
            "<p>" + comment + "</p>" +
            "<div class='caption'>" +
        "</div>" +
        "</div>" +
    "</div>";
}

    var newStr = 'Here we go';
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

$('#topjumbo').on('click', function() {
   $(this).fadeOut(400);
});
