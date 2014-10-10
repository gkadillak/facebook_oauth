/**
 * Created by GKadillak on 10/2/14.
 */
console.log('the page has loaded...');
    $('#getMap').on('click', function() {
        console.log('something has been logged...');
        $.ajax({
            url: "/get_map/",
            dataType: "json",
            type: "GET",
            success: function(data) {
                console.log('Success' + data);
            },
            error: function (data) {
                console.log("no success...");
            }

        })
    });

