// Model
var Model = {
    inherited: function() {},
    created: function() {},

    prototype: {
        init: function() {}
    },

    create: function() {
        var object = Object.create(this);
        object.parent = this;
        object.prototype = object.fn = Object.create(this.prototype);

        object.created();
        this.inherited(object);
        return object;
    },

    init: function() {
        var instance = Object.create(this.prototype);
        instance.parent = this;
        instance.init.apply(instance, arguments);
        return instance;
    },

    extend: function(o) {
        var extended  = o.extended;
        $.extend(this, o);
        if (extended) extended(this);
    },

    include: function(o) {
        var included = o.included;
        $.extend(this.prototype, o);
        if (included) included(this);
    }
};

//Add object properties
$.extend(Model, {
    find: function() {}
});

Model.extend({
    find: function() {}
});

//Add instance properties
$.extend(Model.prototype, {
    init: function(atts) {
        if (atts) this.load(atts);
    },

    load: function() {
        for(var name in attributes)
            this[name] = attributes[name];
    }
});

Model.include({
    init: function(atts) {},
    load: function(attributes) {}
});

// An object of saved assets
Model.records = {};

Model.include({
    newRecord: true,

    create: function() {
        this.newRecord = false;
        this.parent.records[this.id];
    },

    destroy: function() {
        delete this.parent.records[this.id];
    },

    update: function() {
        this.parent.records[this.id] = this;
    },

// Save the object th the records hash, keeping a reference to it
    save: function() {
        this.newRecord ? this.create() : this.update();
    }
});

Model.extend({
    // Fins by ID or rais an exeption
    find: function(id) {
        var record = this.records[id];
        if ( !record ) throw new Error("Unknown record");
        return record;
    },

    populate: function(values) {
        // Reset model & records
        this.records = {};

        for (var i = 0; i < values.length; i++) {
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    }
});

var Asset = Model.create();

// GET requests responses are stored in variables here
var DataModel = {

    selectedItem: null,
    foodList: ko.observableArray([])

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

// Controller ################################################################################
var ViewModel = function() {
	var self = this;
    this.srcInput = ko.observable("");

    this.sendRequests = function() {
        self.yelpRequest();
    };

    this.getCurrentSearch = function() {
        var search = document.getElementById('src-input').value;
        return search;
    };

    // Scroll down to map on click (or enter)
    this.scrollDown = function() {
        $('body').animate({
        scrollTop: $("#page-main").offset().top
        }, 800); //-------------------------------- set scroll speed
        // console.log('scrollDown');
        self.codeAddress();
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
    };

    this.getCurrentModel = function() {
        // creates a new Model object
        self.asset = Asset.init();
    }

    // Google Maps API *******************************************
    this.googleMap = function() {
        self.geocoder;
        self.map;
        self.initialize = function() {
            self.geocoder = new google.maps.Geocoder();
            self.mapOptions = {
                center: new google.maps.LatLng(10, 200),
                zoom: 14,
                scrollwheel: false
            };
            this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
            geocoder.geocode( { 'address': self.getCurrentSearch() }, function(results, status) {
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
                // self.yelpRequest();
            }
        };

        // Create map markers
        self.foodMarkers = function(select) {
            // loop through foodLocation array
            for (var i = 0; i < asset.yelp().length; i++) {

                var item = asset.yelp()[i];

                var foodLoc = new google.maps.LatLng(item.location.lat, item.location.lng);

                var image = 'img/white-pin.png';
                var marker = new google.maps.Marker({
                    position: foodLoc,
                    icon: image
                });

                marker.setMap(map);


                // create info windo object for each object in foodLoccation array
                var infowindow = new google.maps.InfoWindow({
                    content: item.name,
                    position: foodLoc
                });

                // self.foodLocation.push(infowindow);

                google.maps.event.addListener(marker, 'click', (function(select) {
                    return function() {
                        infowindow.open(map, select);
                    }
                })(marker, i));

                // google.maps.event.addListener(marker, 'mouseover', function() {
                //     console.log('TEST');
                // });
                // };

                asset.yelp()[i].markerId = marker + i;
            };


        };

        // takes clicked list item object as parameter.
        self.selectMarker = function(item) {
            if (item != null) {
                self.clearMarker();
            }
            // get map position of clicked item
            var loc = new google.maps.LatLng(item.location.lat, item.location.lng);
            // set marker img
            var image = 'img/red-pin.png';
            //create selected marker object for clicked item
            self.marker = new google.maps.Marker({
                position: loc,
                icon: image,
                zIndex: 1000
            });
            self.marker.setMap(map);

            // console.log(item);

            // google.maps.event.addListener(marker, 'click', (function(marker, i) {
            //     return function() {
            //         infowindow.open(map, marker);
            //     }
            // })(marker, i));
        };

        self.clearMarker = function(item) {
            // clear selected marker if one exists
            if(item != null) {
                self.marker.setMap(null);
            }
        };

        self.infoWindow = function(item) {
            var loc = new google.maps.LatLng(item.location.lat, item.location.lng);
            // create new info window object for clicked item
            var infowindow = new google.maps.InfoWindow({
                content: item.name,
                position: loc
            });
            console.log('test: infowindow');
        }

        self.getCurrentModel(); //------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!   TEMP!!!!!

        google.maps.event.addDomListener(window, 'load', initialize);//<----//
    };                                                                      //
    window.onload = this.googleMap();                                       //
    // window.onload = this.loadScript; //TODO----------------------------- change to activate an search buton click?
    // window.onload = this.initialize;

    // Yelp AJAX request *******************************************
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
            location: self.getCurrentSearch() //------------------------------------------------- bind location to search input value
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

                // // creates a new Model object
                self.asset = Asset.init();
                // give it a yelp property containing the yelp ajax results
                asset.yelp = ko.observableArray([]);

                // create a cache for storing ajax requests
                // DataModel.assetCache = ko.observableArray([]);
                // push yelp results to assetCache
                // DataModel.assetCache.push(results.businesses);
                // self.foodList.push(results.businesses);

                // for (var i = 0; i < foodList.length; i++) {
                // self.foodList.push(asset.yelp.businesses);
                // }

                console.log(results);

                //loop through Yelp businesses array
                for (var i = 0; i < results.businesses.length; i++) {

                    var foodLatLng = {
                        lat: results.businesses[i].location.coordinate.latitude,
                        lng: results.businesses[i].location.coordinate.longitude
                    };

                    // create an object for each business and push each object to the foodList array
                    asset.yelp.push({
                        name: results.businesses[i].name,
                        address: results.businesses[i].location.display_address,
                        url: results.businesses[i].url,
                        phone: results.businesses[i].display_phone,
                        img: results.businesses[i].image_url,
                        rating: results.businesses[i].rating_img_url,
                        text: results.businesses[i].snippet_text,
                        location: foodLatLng,
                        id: i
                    });
                };

                // make Yelp results globaly accessible
                // self.yelpResults = results;
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

    // Ko array containing drop-down menu items
    // this.foodList = DataModel.assetCache;
    // this.foodList = asset.yelp;

    this.testFunction = function() {
        console.log('hello bla bla');
    };

    this.testArray = ko.observableArray([
        {
            name: 'test'
        },
        {
            name: 'test2'
        },
        {
            name: 'test3'
        }

    ]);

    this.listItem = function() {
        this.listDetails = ko.observable(false);
        this.showDetails = function() {
            self.listDetails(true);
            // console.log(1);

        };
        this.hideDetails = function() {
            self.listDetails(false);
        };

        if (self.listDetails == true) {
            var item = self.foodList()[0].id;
            self.selectMarker(item);
            console.log('test');
        }
    };
    this.listItem();

};//------ end ViewModel

// Superslides API
$('#slides').superslides('start');

// Initiate Knockout bindings
ko.applyBindings(ViewModel);