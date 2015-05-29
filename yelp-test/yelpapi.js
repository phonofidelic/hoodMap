yelpRequest = function() {
    var self = this;
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
        location: 'portland' //------------------------------------------------- bind location to search input value
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
            self.asset = Asset.init();
            self.asset.yelp = results;

            // process results
            // console.log(results);
            // // loop through Yelp businesses array
            // for (var i = 0; i < results.businesses.length; i++) {

            //     var foodLatLng = {
            //         lat: results.businesses[i].location.coordinate.latitude,
            //         lng: results.businesses[i].location.coordinate.longitude
            //     };

            //     // create an object for each business and push each object to the foodList array
            //     DataModel.foodList.push({
            //         name: results.businesses[i].name,
            //         address: results.businesses[i].location.display_address,
            //         url: results.businesses[i].url,
            //         phone: results.businesses[i].display_phone,
            //         img: results.businesses[i].image_url,
            //         rating: results.businesses[i].rating_img_url,
            //         text: results.businesses[i].snippet_text,
            //         location: foodLatLng,
            //         id: i
            //     });
            // }

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
    // this.requestSent = true;
};