$(function() {
    var currentSearch = {};
    var currentFBResults = {};
    var tileObj = {};

    var _findIntent = {};
    var _dataType = {};

    _dataType.photo = function(item){
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
    };


    _dataType.status = function(item) {

    };

    _findIntent.get_feed = function () {
        console.log('Your intent is to show the profile');

            $.ajax({
                url: "http://localhost:8000/get_feed",
                dataType: "json"
            }).then(function (data) {
                console.log('Data loaded');
                feedLoaded(data);
            }).fail(function(error){
                alert('Something has gone horribly wrong:', error);
            });
    };

    _findIntent.showProfile = function(){


    };

    function feedLoaded(response){
        var $row = $('.row');
        response.data.forEach(function(item){
            if (item.picture){
                $row.append(putTile(item.picture));
            }
            console.log(item.picture);
        });
    }

    var putTile = function(link){
        return '<div class="item">' +
            '<div class="well">' +
                '<img src="' + link + '" />' +
            '</div>' +
        '</div>'
    };


    _findIntent.get_feed();
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

            // Call the overarching facebook function to match the intent string
            facebookInit('get_feed');


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



    function facebookInit(intent) {
        if (intent === 'show_profile') {

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
                            if (response && !response.error) {
                                alert('You posted:\n' + currentSearch.message_body);

                            }
                        }
                    );
                }
            });
        }

        // LIKE TILE {TILE NUMBER}
        if (intent === 'like_post') {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.api(
                            '/' + tileObj[currentSearch.number] + '/likes',
                        'POST',
                        function (response) {
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

                            $('#displaymessage').html('Hello Mr. ' + response.last_name + '. How are you today?');
                        });
                }
            });
        } //lastname check
    }

}());