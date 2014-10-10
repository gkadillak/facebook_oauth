/**
 * Created by GKadillak on 10/8/14.
 */

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
        var result = voice_string("intent", intent);

        for (var key in entities) {
          var entity = entities[key];

          if (!(e instanceof Array)) {
            result += voice_string(key, entity.value);
          } else {
            for (var i = 0; i < e.length; i++) {
              result += voice_string(key, e[i].value);
            }
          }
        }

        document.getElementById("result").innerHTML = result;
        facebookInit(resultObj)
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
        return key + "=" + value + "\n";
      }

    function facebookInit(intent) {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '779403745457956',
                xfbml: true,
                cookie: true,
                version: 'v2.1'
            });

            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!')
                }
            });

            if (intent === 'get_lastname') {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        FB.api(
                            '/me',
                            {fields: 'last_name'
                            },
                            function (response) {
                                console.log(response);
                            });
                    }
                });
            }

        };
    }


      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
