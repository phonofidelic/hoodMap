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

    // OAuth init
    this.oauth = OAuth({
        consumer: {
            public: '1OuzfDi-n-yJ2dIO-Ert3A',
            secret: '8gxFv_1m-atfA2dU0aMrIY3wOCw'
        },
        signature_method: 'HMAC-SHA1'
    });

    // OAuth request data
    this.request_data = {
        url: 'http://api.yelp.com/v2/search?term=food&location=San+Francisco', //--------------------- add search parameters
        method: 'POST',
        data: {
            status: 'testing 123, hello, hello, check, check...'
        }
    };

    // OAuth token
    this.token = {
        public: 'E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q',
        secret: 'Egb10VCQ2kLIFPpo1QH2k4dgJIo'
    };

    // Yelp Oath
    this.yelpOauth = {
        oauth_consumer_key: '1OuzfDi-n-yJ2dIO-Ert3A'
    }

    // Yelp API ####################################
    this.yelpRequest = function() {
        $.ajax({
            url: self.request_data.url,
            type: self.request_data.method,
            data: self.request_data.data,
            callback: 'cb',
            dataType: 'jsonp',
            crossDomain: true,
            headers: self.oauth.toHeader(self.oauth.authorize(self.request_data, self.yelpOauth))
        }).done(function(data) {
            //process data
            console.log(data);
        });
    };



};


// Superslides API
$('#slides').superslides('start');


// Initiate Knockout bindings
ko.applyBindings(ViewModel);