// Model
// GET requests responses are stored in variables here
var DataModel = {

    selectedItem: null,
    foodList: ko.observableArray([]),
    markerArray: []

	// Google Map

	// wiki-data

    // yelp

};

// Result object prototype
var ResultObject = function(data) {
    this.name = ko.observable(data.name);
    this.web = ko.observable(data.web);
    this.address = ko.observableArray(data.address);
    this.phone = ko.observable(data.phone);
    this.img = ko.observable(data.img);
    this.rating = ko.observable(data.rating);
    this.infoLink = ko.observable(data.infoLink);
};

// Controller
var ViewModel = function() {
	var self = this;
    this.srcInput = ko.observable("");

    // Scroll down to map on click (or enter)
    this.scrollDown = function (){
        $('body').animate({
        scrollTop: $("#page-main").offset().top
        }, 800); //-------------------------------- set scroll speed
        // console.log('scrollDown');
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
        // self.geocoder;
        // self.map;
        self.initialize = function() {
            self.geocoder = new google.maps.Geocoder();
            self.mapOptions = {
                center: new google.maps.LatLng(10, 200),
                zoom: 14,
                scrollwheel: false
            };
            self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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

        // Create map markers
        self.foodMarkers = function() {
            // loop through foodLocation array
            for (var i = 0; i < DataModel.foodList().length; i++) {

                var item = DataModel.foodList()[i];

                var loc = new google.maps.LatLng(item.location.lat, item.location.lng);

                // var image = 'img/white-pin.png';
                // var clicked = 'img/red-pin.png';
                var marker = new google.maps.Marker({
                    position: loc,
                    icon: 'img/white-pin.png',
                    id: i
                });

                DataModel.markerArray.push(marker);

                // make marker red on click
                google.maps.event.addListener(marker, 'click', (function(item) {
                    return function() {
                        self.selectItem(item);
                        DataModel.markerArray[item].setIcon(icon = 'img/red-pin.png');
                        for (var i = 0; i < DataModel.markerArray.length; i++) {
                            //check that we don't reset the selected marker
                            if (i !== item) {
                                DataModel.markerArray[i].setIcon(icon = 'img/white-pin.png');
                            }
                        }
                    };
                })(i));

                // render markers
                marker.setMap(map);
            }
        };

        // set marker img to red on mouseover
        self.mouseoverMarker = function(item) {
            DataModel.markerArray[item.id].setIcon(icon = 'img/red-pin.png');
        };

        // set marker img to white on mouseout
        self.mouseoutMarker = function(item) {
            DataModel.markerArray[item.id].setIcon(icon = 'img/white-pin.png');
        };

        // gets clicked list-item object as input
        self.infoWindow = function(item) {
            var loc = new google.maps.LatLng(item.location.lat, item.location.lng);

            // info window content (move to model?)
            var yelpInfo = '<div class="info-window">' + '<h4>' + item.name + '</h4><div><img src="' + item.rating + '"></div><div>' + item.address[0] +'<br>' + item.address[1] + '<br>' + item.address[2] + '</div><div>' + item.phone + '</div><div><img src="' + item.img + '"></div><div><span>"' + item.text + '"</span><span><a href="' + item.url + '" target="blank">more info</a></span></div></div>';
            // create new info window object for clicked item
            var infowindow = new google.maps.InfoWindow({
                content: yelpInfo,
                position: loc
            });

            infowindow.setMap(map);
        };

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
                // console.log(results);
                // loop through Yelp businesses array
                for (var i = 0; i < results.businesses.length; i++) {

                    var foodLatLng = {
                        lat: results.businesses[i].location.coordinate.latitude,
                        lng: results.businesses[i].location.coordinate.longitude
                    };

                    // create an object for each business and push each object to the foodList array
                    DataModel.foodList.push({
                        name: results.businesses[i].name,
                        address: results.businesses[i].location.display_address,
                        url: results.businesses[i].url,
                        phone: results.businesses[i].display_phone,
                        img: results.businesses[i].image_url,
                        rating: results.businesses[i].rating_img_url,
                        text: results.businesses[i].snippet_text,
                        location: foodLatLng,
                        id: i,
                        google_marker: {}
                    });
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

    // // function that returns Yelp items array
    // this.getItems = function() {
    //     return DataModel.foodList();
    // };

    // selects a list item on click -------------------------------- SELECTOR
    this.selectItem = function(item) {
        DataModel.selectedItem = item;
        console.log(item);
        return item;
    };

    // Ko array containing drop-cown menu items
    this.foodList = DataModel.foodList;


};//------ end ViewModel

// Superslides API
$('#slides').superslides('start');


// Initiate Knockout bindings
ko.applyBindings(ViewModel);