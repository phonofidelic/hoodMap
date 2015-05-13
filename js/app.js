// Model
// GET requests responses are stored in variables here
var DataModel = [
	// Google Map




	// wiki-data
];

// Controller

var ViewModel = function() {
	var self = this;
    this.srcInput = ko.observable("");

    // Scroll down to map on click (or enter)
    this.scrollDown = function (){
        $('body').animate({
        scrollTop: $("#page-main").offset().top
        }, 800); //-------------------------------- set scrool speed

    console.log('scrollDown');
    };
    $('#src-form').submit(this.scrollDown);

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

};


// Superslides API
$('#slides').superslides();


// Initiate Knockout bindings
ko.applyBindings(ViewModel);