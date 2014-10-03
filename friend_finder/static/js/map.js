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
        if (photo.place != undefined) {
            addMarker(photo, map, i);
        }
    }
}

var markers = [];
var infoWindows = [];

function addMarker(photo, map, counter) {
    var myLatLng = new google.maps.LatLng(photo.place.location.latitude,
                                          photo.place.location.longitude);

    var image = {
        url: photo.picture,
        scaledSize: new google.maps.Size(200, 200),

    };
    infoWindows[counter] = new google.maps.InfoWindow ({
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

google.maps.event.addDomListener(window, 'load', initialize);
