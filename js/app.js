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
        }, 800); //-------------------------------- set scrool speed

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
            if (self.requestSent != true) {
                self.yelpRequest();
            }
        };

        self.foodMarkers = function() {
            var foodLoc = new google.maps.LatLng(foodLocation[0].lat, foodLocation[0].lon);

            var marker = new google.maps.Marker({
                position: foodLoc
            });
            marker.setMap(map);
        };
    };
    window.onload = this.googleMap();
    // window.onload = this.loadScript; //TODO----------------------------- change to activate an search buton click?
    window.onload = this.initialize;

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
                    self.foodList.push(foodEntry);

                    var foodLatLon = {
                    lat: results.businesses[i].location.coordinate.latitude,
                    lon: results.businesses[i].location.coordinate.longitude
                    };

                    self.foodLocation.push(foodLatLon);
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

    this.foodList = ko.observableArray([]);

    this.foodLocation = [];

    // this.yelpResults.businesses.forEach()
};//------ ViewModel

// Superslides API
$('#slides').superslides('start');


// Initiate Knockout bindings
ko.applyBindings(ViewModel);