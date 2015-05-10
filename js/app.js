// Model
// GET requests responses are stored in variables here
var DataModel = [
	// Google Map
	{
		map: new mapTools({
      id: 'mymap',
      lat: 41.3833,
      lng: 2.1833,
      on: {
        tilesloaded: function() {
          console.log('tiles loaded')
        }
      },
      scrollwheel: false,
    }, function (err, map) {
      if (!err) {
        console.log('Map Loaded!', map.instance);
      }
    })
	}

	// wiki-data
];

// Controller
var ViewModel = function() {
	var self = this;

	// Return google street view images based on search input
	this.srcSubmit = function() {
		// get input from search form
		this.srcInput = $('#src-form').val;
    console.log(this.srcInput);
	};

  // Scroll down to map on click
  this.scrollDown = function() {
        // Scroll-down animation
    $(document).ready(function (){
        $("#search").click(function (){
            //$(this).animate(function(){
                $('html, body').animate({
                    scrollTop: $("#page-main").offset().top
                }, 800);
            //});
        });
    });
  };

  this.mapInit = function() {
    map.instance;
  };


};

// var googleMap = function() {
//   var map = new mapTools({
//     id: 'mymap',
//     lat: 41.3833,
//     lng: 2.1833
//   }, function (err, map) {
//     if (!err) {
//       console.log('Map Loaded!', map.instance);
//     }
//   });
// }


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

// function codeAddress() {
//   var address = document.getElementById('loc-src-input').value;
//   geocoder.geocode( { 'address': address}, function(results, status) {
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

// google.maps.event.addDomListener(document.getElementById('search'), 'click', initialize);

//!!!!!!!!! add onclick="codeAddress()" to search button in index.html!!!!!!!!!!!




// Superslides API
$('#slides').superslides();


// Initiate Knockout bindings
ko.applyBindings(new ViewModel());