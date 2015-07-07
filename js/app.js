// Model
// GET requests responses are stored in variables here
var DataModel = {

    selectedItem: ko.observable(),
    currentLoc: null,
    itemList: ko.observableArray(),
    // foodList: ko.observableArray([]),
    // artsList: ko.observableArray([]),
    markerArray: ko.observableArray(),
    // artMarkerArray: ko.observableArray([]),
    categories: ko.observableArray(),
    specSearch: ko.observable(''),
    srcType: '',
    listFilter: ko.observableArray()
};


// Controller
var ViewModel = function() {
	var self = this;
    // this.srcInput = ko.observable("");

    // Scroll down to map on click (or enter)
    this.scrollDown = function () {
        $('body').animate({
        scrollTop: $("#page-main").offset().top
        }, 800); //-------------------------------- set scroll speed
        // console.log('scrollDown');

        // yelp requests are sent in the transition from landing page to main app interface -------------------send requests
        // arguments: search parameters, list type
        self.yelpRequest('food,coffee,bars', 'food'); //DataModel.foodList
        self.yelpRequest('arts', 'art'); //DataModel.artsList
        // TODO: third request: hotels?/transportation?
    };
    // $('#src-form').submit(this.scrollDown);

    this.focusMap = function() {
        $('body').animate({
            scrollTop: $('#page-main').offset().top
        }, 800);
        console.log('test: focusMap');
    };
    // $('.show-on-map').click(this.focusMap);


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
                scrollwheel: false,
                mapTypeControl: false,
                panControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.TOP_RIGHT
                }
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
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        };

        // Create map markers
        self.renderMarkers = function() {
            // clear markerArray if there are objects in it
            if (DataModel.markerArray().length > 0) {
                DataModel.markerArray.removeAll();
            }
            // loop through itemList
            for (var i = 0; i < DataModel.itemList().length; i++) {

                //set up for itemMarker
                var type = DataModel.itemList()[i].type;
                item = DataModel.itemList()[i];
                loc = new google.maps.LatLng(item.location.lat, item.location.lng);

                // create new Marker object
                itemMarker = new Marker({
                    map: map,
                    title: 'Map Icons',
                    position: loc,
                    icon: {
                        path: SQUARE_PIN,
                        fillColor: '#fff',
                        fillOpacity: 1,
                        strokeColor: '#000',
                        strokeWeight: 1,
                        scale: 1/3
                    },
                    object: item,
                    type: 'food',
                    zIndex: 9,
                    label: (function(){
                        // check if business is a cafe
                        if (DataModel.categories()[i].item.indexOf("Coffee") > -1) {
                            return '<i class="map-icon-cafe"></i>';
                        // check if buisness is a bar
                        } else if (DataModel.categories()[i].item.indexOf("bars") > -1) {
                                return '<i class="map-icon-night-club"></i>';
                        // check if buisness is a museum
                        } else if (DataModel.categories()[i].item.indexOf("museum") > -1) {
                                return '<i class="map-icon-museum"></i>';
                        } else if (DataModel.categories()[i].item.indexOf("art, gallery") > -1) {
                                return '<i class="map-icon-art-gallery"></i>';
                        // default to restaurant
                        } else {
                            return '<i class="map-icon-point-of-interest"></i>';
                        }
                    })(),
                    anchorPoint: (1, 1)
                });

                DataModel.itemList()[i].marker = itemMarker;
                DataModel.markerArray().push(itemMarker);

                // make marker red on click
                google.maps.event.addListener(itemMarker, 'click', (function(item) {
                    return function() {
                        console.log(DataModel.itemList()[item]);
                        // open infowindow on marker click
                        self.infoWindow(DataModel.itemList()[item]);

                        // self.selectItem(item);
                        DataModel.markerArray()[item].setIcon(icon = {
                            path: SQUARE_PIN,
                            fillColor: '#e03934',
                            fillOpacity: 1,
                            strokeColor: '#000',
                            strokeWeight: 1,
                            scale: 1/3
                        });
                        for (var i = 0; i < DataModel.markerArray().length; i++) {
                            //check that we don't reset the selected marker
                            if (i !== item) {

                                DataModel.markerArray()[i].setIcon(icon = {
                                    path: SQUARE_PIN,
                                    fillColor: '#fff',
                                    fillOpacity: 1,
                                    strokeColor: '#000',
                                    strokeWeight: 1,
                                    scale: 1/3
                                });
                            }
                        }
                    };
                })(i));

                // render markers
                itemMarker.setMap(map);
            }
        };

        // set marker img to red on mouseover
        self.mouseoverMarker = function(item) {
            var type = item.type;
            // if (item.type == 'food') {
                DataModel.markerArray()[item.id].setIcon(icon = {
                    path: SQUARE_PIN,
                    fillColor: '#e03934',
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 1,
                    scale: 1/3
                });
                DataModel.markerArray()[item.id].setZIndex(zIndex = 99);
            // }
        };

        // set marker img to white on mouseout
        self.mouseoutMarker = function(item) {
            var type = item.type;
            // if (item.type == 'food') {
                DataModel.markerArray()[item.id].setIcon(icon = {
                            path: SQUARE_PIN,
                            fillColor: '#fff',
                            fillOpacity: 1,
                            strokeColor: '#000',
                            strokeWeight: 1,
                            scale: 1/3
                            });
                DataModel.markerArray()[item.id].setZIndex(zIindex = 1);
        };

        // gets clicked list-item object as input
        self.infoWindow = function(item) {
            var loc = new google.maps.LatLng(item.location.lat, item.location.lng);
            var offset = new google.maps.Size(0, -25);

            // info window content ---------------------------------------------------------------(move to model?)
            var yelpInfo = '<div class="info-window">' +'<h4>' +
                item.name + '</h4><div><img src="' +
                item.rating + '"></div><div>' +
                item.address[0] +'<br>' + item.address[1] + '<br>' + item.address[2] + '</div><div>' +
                item.phone + '</div><div><img src="' + item.img + '"></div><div><span>"' +
                item.text + '"</span><span><a href="' +
                item.url + '" target="blank">more info at <img src="img/yelpLogo.png"></a></span></div></div>';

            // create new info window object for clicked item
            var infowindow = new google.maps.InfoWindow({
                content: yelpInfo,
                position: loc,
                pixelOffset: offset
            });

            infowindow.setMap(map);

            // logs list item's business categorie from DataModel.categories
            // console.log(DataModel.categories()[item.id]);

            // logs list item object from DataModel.itemList
            // console.log(DataModel.itemList()[item.id]);
        };

        google.maps.event.addDomListener(window, 'load', initialize);//<----//
    };                                                                      //
    // window.onload = this.googleMap();                                       //
    // window.onload = this.loadScript; //TODO----------------------------- change to activate an search buton click?
    // window.onload = this.initialize;



    // holds src-input2 value
    this.specSearch = ko.observable();

    this.searchFilter = function() {
        // event listner kicks off filtering on each key-stroke
        $('#src-input2').keyup(function() {

            //loop through itemList and match each item against current input
            for (var i = 0; i < DataModel.itemList().length; i++) {
                    //list to search throug
                var listItem = DataModel.categories()[i].item,
                    //current input
                    srcTerm = new RegExp(self.specSearch(), 'gi'),
                    //item to be shown or hidden
                    item = DataModel.itemList()[i];

                if (listItem.match(srcTerm)) {
                    item.visible(true);
                } else {
                    item.visible(false);
                }
                console.log(i);
                console.log('listItem: '+ listItem);
                console.log('srcTerm: ' +srcTerm);
                console.log(DataModel.itemList()[i].visible());
            }
        });


    };

    // Yelp AJAX request #####################################
    this.yelpRequest = function(search, listType) {

        // clear itemList before making new request
        if (DataModel.itemList().length > 0) {
            DataModel.itemList.removeAll();
        }

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
            tearm: '', //OPTION/TODO----------------------------------------- search term
            limit: 20,
            radius_filter: 40000,
            category_filter: search,
            location: DataModel.currentLoc //------------------------------------------------- bind location to search input value
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

                console.log(results);

                // Clear old result items and markers befor sending new request (if they exist)
                if (DataModel.itemList.length > 0) {
                    DataModel.itemList.removeAll();
                }
                if (DataModel.markerArray.length > 0) {
                    DataModel.markerArray.removeAll();
                }

                // process results

                // loop through Yelp businesses array
                for (var i = 0; i < results.businesses.length; i++) {

                    // create an object for each business and push each object to the itemList array
                    DataModel.itemList.push({
                        name: results.businesses[i].name,
                        address: results.businesses[i].location.display_address,
                        url: results.businesses[i].url,
                        phone: results.businesses[i].display_phone,
                        img: results.businesses[i].image_url,
                        street_view: 'https://maps.googleapis.com/maps/api/streetview?key=AIzaSyDsUk8JPHC9zfd3CLCEAk9kRVR9RpopZN4&size=400x300&location='+results.businesses[i].location.display_address,
                        rating: results.businesses[i].rating_img_url,
                        text: results.businesses[i].snippet_text,
                        location: {
                            lat: results.businesses[i].location.coordinate.latitude,
                            lng: results.businesses[i].location.coordinate.longitude
                        },
                        id: i,
                        type: listType,
                        categories: results.businesses[i].categories,
                        marker: {},
                        visible: ko.observable(true)
                    });

                    // push each items categories as a string object to DataModel.categories array
                    var categories = (function() {
                        if (results.businesses[i].categories != undefined) {
                            categorieArr = results.businesses[i].categories.toString();
                            DataModel.categories.push(
                                {item: categorieArr}
                                );
                        }
                    })();
                }
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


    // selects a list item on click -------------------------------- SELECTOR
    // and updated DataModel.selectedItem
    this.selectItem = function(item) {
        DataModel.selectedItem = item;
        // console.log(item);
        return item;
    };

    this.currentLoc = function(item) {
        var loc = document.getElementById('src-input').value;
        DataModel.currentLoc = loc;
        console.log(loc);
        codeAddress();
        scrollDown();
        // eatSearch();
        // artsSearch();
    };


    this.eatSearch = function() {
        self.yelpRequest('food,coffee,bars');
        DataModel.srcType = 'food';
        console.log('test food');
    };

    this.artsSearch = function() {
        self.yelpRequest('arts');
        DataModel.srcType = 'arts';
        console.log('test art');
    };

    // Ko array containing drop-cown menu items------------------------------------------- REDUNDANT???
    this.foodList = DataModel.foodList;
    this.artsList = DataModel.artsList;
    this.itemList = DataModel.itemList;


    this.locationInput = ko.observable();

    // initialize...
    window.onload = this.googleMap();
    window.onload = this.searchFilter();
};//------ end ViewModel

// Superslides API
$('#slides').superslides('start');



// Initiate Knockout bindings
ko.applyBindings(ViewModel);