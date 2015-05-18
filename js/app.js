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
    this.geocoder;
    this.map;
    this.initialize = function() {
        self.geocoder = new google.maps.Geocoder();
        self.mapOptions = {
            center: new google.maps.LatLng(10, 10),
            zoom: 12,
            scrollwheel: false
        };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };

    this.loadScript = function() {
        self.script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=false&callback=initialize'; //------------------------ set signed_in state to true or false
        document.body.appendChild(script);
    }


    this.codeAddress = function() {
        self.address = document.getElementById('src-input').value;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        console.log('codeAddress');
    };
    window.onload = this.loadScript; //----------------------------- change to activate an search buton click?
    window.onload = this.initialize;


    // Random nonce generator
    this.nonceMaker = function() {
        return (Math.floor(Math.random() * 1e12).toString());
    };

    this.yelp_url = 'http://api.yelp.com/v2/' + 'search?' + 'portland';

    this.consumerSecret = '8gxFv_1m-atfA2dU0aMrIY3wOCw';
    this.tokenSecret = 'Egb10VCQ2kLIFPpo1QH2k4dgJIo';

    this.parameters = {
        oauth_consumer_key: '1OuzfDi-n-yJ2dIO-Ert3A',
        oauth_token: 'E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q',
        oauth_nonce: nonceMaker(),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb'
    }

    this.encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, consumerSecret, tokenSecret);
    this.parameters.oath_signature = this.encodedSignature;

    this.settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function(results) {
            // process results
            console.log(results);
        },
        fail: function() {
            // procrss fail
            console.log('failed');
        }
    };

    this.yelpRequest = function() {
        $.ajax(settings);
    }
};


// Superslides API
$('#slides').superslides('start');


// Initiate Knockout bindings
ko.applyBindings(ViewModel);