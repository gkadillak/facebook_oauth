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

        FB.login(function (response) {}, {scope: 'user_friends, publish_actions, read_stream, manage_notifications'});


        }; //AsyncInit

    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    function facebookInit(intent) {
        if (intent === 'show_profile') {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api(
                        "/me/feed",
                        function (response) {
                            // Hard code '0' just to get the profile owner out
                            console.log(response);
                            $('#front_title').hide(400);
                            $('#frontTile').append('<h1>' + response.data[0].from.name + '</h1>');
                            for (var i = 0; i < response.data.length; i++) {
                                // Only get the 'photo' types
                                if (response.data[i].type === 'photo') {
                                    var rawPic;
                                    var message;
                                    var avatar;
                                    var author;
                                    var postNumber;
                                    var story;
                                    var linkNum;

                                    if (response.data[i].picture.search('s130x130') > 0) {
                                        rawPic = response.data[i].picture.replace('/s130x130', '');
                                    }
                                    else {
                                        rawPic = response.data[i].picture.replace('/p130x130', '');
                                    }

                                    var largePic = rawPic.replace('/v', '');

                                    // Show the message if it exists
                                    if (typeof response.data[i].message != 'undefined') {
                                        message = response.data[i].message
                                    }

                                    else {
                                        message = '';
                                    }

                                    // Display the story if it exists
                                    if (typeof response.data[i].story != 'undefined') {
                                        story = response.data[i].story;
                                    }
                                    else {
                                        story = '';
                                    }

                                    // Avatar is the mini profile picture
                                    avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                                    author = response.data[i].from.name;
                                    postNumber = i;
                                    linkNum = i;


                                    // Create the HTML styling and add to page
                                    var frontTiles = imageTile(largePic, message, avatar, author, postNumber, story, linkNum);
                                    $('#frontTile').append(frontTiles);


                                    // Add the object ID to a global object to be able to 'like' it later
                                    tileObj[i] = response.data[i].id;

                                }

                                else if (response.data[i].type === 'status') {
                                    var comment;
                                    if (typeof response.data[i].message != 'undefined') {
                                            comment = response.data[i].message;
                                        }
                                    else {
                                        comment = response.data[i].story;
                                    }

                                    var avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                                    var author = response.data[i].from.name;
                                    var number = i;
                                    var likeNum = i;
                                    var frontTiles = commentTile(comment, avatar, author, number, likeNum);
                                    $('#frontTile').append(frontTiles);

                                    // Add the object ID to a global object to be able to 'like' it later
                                    tileObj[i] = response.data[i].id;
                                }
                            }
                        }
                    );
                }
              });
        }

        if (intent === 'scroll') {
            if (currentSearch.direction === 'down') {
                $.smoothScroll(200);
            }

            else if (currentSearch.direction === 'up') {
                    $.smoothScroll(-200);
            }
        }
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
                                alert('You posted:\n' + currentSearch.message_body);

                            }
                        }
                    );
                }
            });
        }

        // LIKE TILE {TILE NUMBER}
        if (intent === 'like_post') {
            FB.getLoginStatus(function (response){
                if (response.status === 'connected') {
                    FB.api (
                        '/' + tileObj[currentSearch.number] + '/likes',
                        'POST',
                        function (response){
                            // If success, append a cute little thumbs up next to the post number
                            if (response && !response.error) {
                            console.log(response);
                            $('#like_' + currentSearch.number).html(
                                '<img src="http://3.bp.blogspot.com/-6dmLiW9yjrE/TrI4xXtpPLI/AAAAAAAAB5M/ozDIGs0LOkE/s400/FacebookChatEmoticonsTumbUpLikeMessengeRoo.jpg" />'
                            );
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

        // GET MY FEED
        if (intent === 'get_feed') {
            FB.getLoginStatus(function (response){
               FB.api(
                    '/me/home',
                   function (response){
                       console.log(response);
                       $('#front_title').hide(400);
                       for (var i = 0; i < response.data.length; i++) {
                           // Only get the 'photo' types
                           if (response.data[i].type === 'photo') {
                               var rawPic;
                               var message;
                               var avatar;
                               var author;
                               var postNumber;
                               var story;
                               var linkNum;

                               if (response.data[i].picture.search('s130x130') > 0) {
                                   rawPic = response.data[i].picture.replace('/s130x130', '');
                               }
                               else  {
                                   rawPic = response.data[i].picture.replace('/p130x130', '');
                               }

                               var largePic = rawPic.replace('/v', '');

                               // Show the message if it exists
                               if (typeof response.data[i].message != 'undefined') {
                                   message = response.data[i].message
                               }

                               else {
                                   message = '';
                               }

                               // Display the story if it exists
                               if (typeof response.data[i].story != 'undefined'){
                                   story = response.data[i].story;
                               }
                               else {
                                   story = '';
                               }

                               // Avatar is the mini profile picture
                               avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                               author = response.data[i].from.name;
                               postNumber = i;
                               linkNum = i;


                               // Create the HTML styling and add to page
                               var frontTiles = imageTile(largePic, message, avatar, author, postNumber, story, linkNum);
                               $('#frontTile').append(frontTiles);


                               // Add the object ID to a global object to be able to 'like' it later
                               tileObj[i] = response.data[i].id;

                           }

                           else if (response.data[i].type === 'status') {

                               var comment = response.data[i].message;
                               var avatar = "https://graph.facebook.com/" + response.data[i].from.id + "/picture";
                               var author = response.data[i].from.name;
                               var number = i;
                               var likeNum = i;
                               var frontTiles = commentTile(comment, avatar, author, number, likeNum);
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
function imageTile(imageSrc, title, avatar, author, number, story, likeNum) {

    return "<div class='col-sm-6 col-md-4' id='fullTile'>" +
            "<div class='thumbnail'>" +
                "<p>" + number + "<span id='like_" + likeNum + "'</span></p>" +
                "<p><img src='" + avatar +  "' /> " + author+ "</p>" +
                "<h3>" + title + "</h3>" +
                "<p>" + story + "</p>" +
                "<img src='" + imageSrc + "' data-src='holder.js/200x200' alt='...'>" +
                "<div class='caption'>" +
            "</div>" +
            "</div>" +
        "</div>";
}

function commentTile(comment, avatar, author, number, likeNum){

    return "<div class='col-sm-6 col-md-4' id='fullTile'>" +
        "<div class='thumbnail'>" +
            "<p>" + number + "</p>" +
            "<p><img src='" + avatar +  "' /> " + author+ "<span id='like_'" + likeNum + "'></span></p>" +
            "<p>" + comment + "</p>" +
            "<div class='caption'>" +
        "</div>" +
        "</div>" +
    "</div>";
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
