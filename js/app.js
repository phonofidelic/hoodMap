// Model
// GET requests responses are stored in variables here
var DataModel = [
	// Google Map




	// wiki-data
];

// Controller

//setup Google map object
var GoogleMap = function() {

  this.initialize = function() {
    var mapOptions = {
      center: new google.maps.LatLng(10, 10),
      zoom: 2,
      scrollwheel: false
    };

    var map = new google.maps.Map(document.getElementById('mymap'), mapOptions);
  };

  this.loadScript = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=false&callback=initialize'; //------------------------ set signed_in state to true or false
    document.body.appendChild(script);
  }

  window.onload = this.loadScript;
}

var ViewModel = function() {
	var self = this;

  this.srcInput = ko.observable("");

	// Return google street view images based on search input
	this.srcSubmit = function() {
		// get input from search form
		// this.srcInput = ko.observable("srcLocation");
    // self.srcInput = $('#src-input').val();
    // return self.srcInput;
    console.log(self.srcInput());
	};

  // Scroll down to map on click
  this.scrollDown = function() {
        // Scroll-down animation
    // $(document).ready(function (){
        $("#search").click(function (){
            // $(this).animate(function(){
                $('body').animate({
                    scrollTop: $("#page-main").offset().top
                }, 800);
            // });
        });
    // });
    console.log('scrollDown')
  };

  // this.codeAddress = function() {
  //   var address = document.getElementById('src-input').value;
  //   DataModel.geocoder.geocode( { 'address': address}, function(results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       map.setCenter(results[0].geometry.location);
  //       var marker = new google.maps.Marker({
  //           map: map,
  //           position: results[0].geometry.location
  //       });
  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // };
};


// Superslides API
$('#slides').superslides();


// Initiate Knockout bindings
ko.applyBindings(new ViewModel(), GoogleMap());