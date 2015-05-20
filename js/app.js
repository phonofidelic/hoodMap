// Model
// GET requests responses are stored in variables here
var DataModel = [
	// Google Map

	// wiki-data

    // yelp

];

// Controller

var ViewModel = function() {
	var self = this;
    this.srcInput = ko.observable("");

    // Nav bar
    this.navBar = function() {

    }

    // Scroll down to map on click (or enter)
    this.scrollDown = function (){
        $('body').animate({
        scrollTop: $("#page-main").offset().top
        }, 800); //-------------------------------- set scroll speed

        console.log('scrollDown');
    };
    $('#src-form').submit(this.scrollDown);

    // Superslides
    this.superSlides = function() {
        $('#slides').superslides({
            hashchange: false,
            pagination:true,
            play: 5000
        });
        $('#slides').superslides('start');
    }

    // Google Maps API ###################################
    this.googleMap = function() {
        self.geocoder;
        self.map;
        self.initialize = function() {
            self.geocoder = new google.maps.Geocoder();
            self.mapOptions = {
                center: new google.maps.LatLng(10, 200),
                zoom: 12,
                scrollwheel: false
            };
            this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        };

        self.loadScript = function() {
            self.script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
            '&signed_in=false&callback=initialize'; //OPTION------------------------ set signed_in state to true or false
            document.body.appendChild(script);
        };


        self.codeAddress = function() {
            self.address = document.getElementById('src-input').value;
            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    // // Map marker for initial position
                    // var marker = new google.maps.Marker({
                    //     map: map,
                    //     position: results[0].geometry.location
                    // });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
            // console.log('codeAddress');

            // check if request has been sent
            // if not, send request
            if (self.requestSent != true) { //TODO-------------------------------- fix to reset Yelp request results on new search
                self.yelpRequest();
            }
        };

        // Creare map markers
        self.foodMarkers = function() {
            // loop through foodLocation array
            for (var i = 0; i < foodLocation.length; i++) {
                // create a marker object for each object in foodLocation array
                var foodLoc = new google.maps.LatLng(foodLocation[i].lat, foodLocation[i].lon);

                var marker = new google.maps.Marker({
                    position: foodLoc
                });
                marker.setMap(map);

                // create info windo object for each object in foodLoccation array
                var infowindow = new google.maps.InfoWindow({
                    content: self.foodLocation[i].foodName,
                    position: foodLoc
                });

                // self.foodLocation.push(infowindow);

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
            }
        };

        // self.infoWindows = function() {
        //     for (var i = 0; i < foodLocation.length; i++) {
        //         self.infowindo = new google.maps.InfoWindow({
        //             content: 'Content goes here'
        //         });
        //     }
        // };



        google.maps.event.addDomListener(window, 'load', initialize);//<----//
    };                                                                      //
    window.onload = this.googleMap();                                       //
    // window.onload = this.loadScript; //TODO----------------------------- change to activate an search buton click?
    // window.onload = this.initialize;

    // Yelp AJAX request #####################################
    this.yelpRequest = function() {
        // Random nonce generator
        this.nonceMaker = function() {
            return (Math.floor(Math.random() * 1e12).toString());
        };

        // yelp base-url
        this.yelp_url = 'http://api.yelp.com/v2/search/';

        this.consumerSecret = '8gxFv_1m-atfA2dU0aMrIY3wOCw';
        this.tokenSecret = 'Egb10VCQ2kLIFPpo1QH2k4dgJIo';

        this.parameters = {
            oauth_consumer_key: '1OuzfDi-n-yJ2dIO-Ert3A',
            oauth_token: 'E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q',
            oauth_nonce: nonceMaker(),
            oauth_timestamp: Math.floor(Date.now()/1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb',
            tearm: 'food', //OPTION/TODO----------------------------------------- search term
            location: address //------------------------------------------------- bind location to search input value
        };

        // appends generated oauth-signature to parameters obj
        this.encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, consumerSecret, tokenSecret);
        this.parameters.oauth_signature = this.encodedSignature;

        // ajax request settings
        this.settings = {
            url: yelp_url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function(results) {
                // process results
                console.log(results);
                // loop through Yelp businesses array
                for (var i = 0; i < results.businesses.length; i++) {

                    // create an object for each business name
                    var foodEntry = results.businesses[i].name;

                    // push each foodEntry object to the foodList array
                    self.foodList.push({name: foodEntry});

                    var foodLatLng = {
                    lat: results.businesses[i].location.coordinate.latitude,
                    lon: results.businesses[i].location.coordinate.longitude
                    };

                    self.foodLocation.push(foodLatLng);

                    foodLatLng.foodName = results.businesses[i].name;
                    // self.foodLocation.push(foodName);
                };

                // make Yelp results globaly accessible
                self.yelpResults = results;
            },
            fail: function() {
                // procrss fail
                console.log('failed');
            }
        };

        // send request
        $.ajax(settings);//TODO--------------------------------------- bind call to search event
        this.requestSent = true;
    };

    // Ko array containing drop-cown menu items
    this.foodList = ko.observableArray([]);

    // array containing Yelp results info
    this.foodLocation = [];

};//------ end ViewModel

// Superslides API
$('#slides').superslides('start');


// Initiate Knockout bindings
ko.applyBindings(ViewModel);