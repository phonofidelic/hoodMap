// Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelp = require("yelp").createClient({
  consumer_key: "1OuzfDi-n-yJ2dIO-Ert3A",
  consumer_secret: "8gxFv_1m-atfA2dU0aMrIY3wOCw",
  token: "E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q",
  token_secret: "Egb10VCQ2kLIFPpo1QH2k4dgJIo"
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "food", location: "Montreal"}, function(error, data) {
  console.log(error);
  console.log(data);
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business("yelp-san-francisco", function(error, data) {
  console.log(error);
  console.log(data);
});


$.post( "ajax/test.html", function( data ) {
 	$( ".result" ).html( data );
});

$.get( "ajax/test.html", function( data ) {
 	 $( ".result" ).html( data );
  	alert( "Load was performed." );
});

