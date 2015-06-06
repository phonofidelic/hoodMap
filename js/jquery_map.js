$('#map_canvas').gmap({'options'}).bind('init', function() {
	for (var i = 0; i < DataModel.foodlist().length; i++) {
		$('#map_canvas').gmap('addMarker', {'posision': loc, 'image': 'img/white-pin.png'}).click(function() {
			$('#map_canvas').gmap('openInfoWindow', {'content': 'TEST'}, this);
			// marker image = img/red-pin.png
		});
	}
});