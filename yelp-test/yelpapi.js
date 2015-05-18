// function nonceMaker() {
//     return (Math.floor(Math.random() * 1e12).toString());
// };

// var httpMethod = 'GET',
//     url = 'http://photos.example.net/photos',
//     parameters = {
//         oauth_consumer_key : '1OuzfDi-n-yJ2dIO-Ert3A',
//         oauth_token : 'E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q',
//         oauth_nonce : nonceMaker(),
//         oauth_timestamp : Math.floor(Date.now()/1000),
//         oauth_signature_method : 'HMAC-SHA1',
//         oauth_version : '1.0',
//         callback: 'cb'
//     },
//     consumerSecret = 'kd94hf93k423kf44',
//     tokenSecret = 'pfkkdhi9sl3r4s00',
//     // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
//     encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret),
//     // generates a BASE64 encode HMAC-SHA1 hash
//     signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,
//         { encodeSignature: false});

    /**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonceMaker() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = 'http://api.yelp.com/v2/search/';

var YELP_KEY_SECRET = '8gxFv_1m-atfA2dU0aMrIY3wOCw';

var YELP_TOKEN_SECRET = 'Egb10VCQ2kLIFPpo1QH2k4dgJIo';

var parameters = {
    oauth_consumer_key : '1OuzfDi-n-yJ2dIO-Ert3A',
    oauth_token : 'E8UWzwkiKlCxrsiiH7yHvgWoQ66bm87Q',
    oauth_nonce : nonceMaker(),
    oauth_timestamp : Math.floor(Date.now()/1000),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb',
    tearm: 'food',
    location: 'portland'
};

var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

var settings = {
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(results) {
    // Do stuff with results
    console.log(results);
    },
    fail: function() {
    // Do stuff on fail
    console.log('failed');
    }
};

function sendRequest(){
// Send AJAX query via jQuery library.
$.ajax(settings);
};