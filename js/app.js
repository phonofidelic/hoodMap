// Model
// GET requests responses are stored in variables here
var DataModel = [
	// Google Map
  {
    geocoder: {},
    map: null
  }



	// wiki-data
];

// Controller
var GoogleMap = function() {

  this.initialize = function() {
    DataModel.geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(0,0);
    var mapOptions = {
      zoom: 12,
      center: latlng,
      scrollwheel: false
    }
    DataModel.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  };
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

  this.codeAddress = function() {
    var address = document.getElementById('src-input').value;
    DataModel.geocoder.geocode( { 'address': address}, function(results, status) {
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
  };
};


// Scetch - initialize map and slides TODO: remove!!!!!!!!!!!!!!!!!

// //Google Maps API
// var geocoder = {};
// var map;
// function initialize() {
//   geocoder = new google.maps.Geocoder();
//   var latlng = new google.maps.LatLng(0,0);
//   var mapOptions = {
//     zoom: 12,
//     center: latlng,
//     scrollwheel: false
//   }
//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// };

function codeAddress() {
  var address = document.getElementById('loc-src-input').value;
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
};

google.maps.event.addDomListener(document.getElementById('search'), 'click', GoogleMap.initialize);

//!!!!!!!!! add onclick="codeAddress()" to search button in index.html!!!!!!!!!!!




// Superslides API
$('#slides').superslides();


// Initiate Knockout bindings
ko.applyBindings(new ViewModel());