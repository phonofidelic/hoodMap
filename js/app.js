// Model
// GET requests responses are stored in variables here
var DataModel = [
	// google
	{
		url: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDsUk8JPHC9zfd3CLCEAk9kRVR9RpopZN4&q='
	}

	// wiki-data
];

// Controller
var ViewModel = function() {
	var self = this;

	this.srcSubmit = function() {
		// get input from search form
		this.srcInput = $('#loc-src-input').val(),

		//get src string from DataModel
		this.mapURL = DataModel[0].url + this.srcInput;



		// $('#map-canvas').append('<iframe frameborder="0" style="border:0" src="' + this.mapURL + '"></iframe>');

		console.log('test');
	};


};

// Scetch - initialize map and slides TODO: remove!!!!!!!!!!!!!!!!!

//Google Maps API
var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(0,0);
  var mapOptions = {
    zoom: 8,
    center: latlng,
    scrollwheel: false
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

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
}

google.maps.event.addDomListener(window, 'load', initialize);


// Superslides API
$('#slides').superslides();



// Initiate Knockout bindings
ko.applyBindings(new ViewModel());