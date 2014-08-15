var data_places = [];
var map;
var latlng = [];
var markers = [];
var icon = {
  path: google.maps.SymbolPath.CIRCLE,
  strokeColor: 'gold',
  fillColor: 'gold',
  fillOpacity: 1.0,
  scale: 3
};
var iconSelected = {
  path: google.maps.SymbolPath.CIRCLE,
  strokeColor: 'red',
  fillColor: 'red',
  fillOpacity: 1.0,
  scale: 6
};

function mapHighlightPoint(time) {
    var d = new Date(time);
    epoch = d.getTime() / 1000;
    $.each(data_places['places'], function(i,val) {
        if (epoch > parseInt(val['time_start']) && epoch < parseInt(val['time_end'])) {
            mapResetIcons();
	    	markers[i].setIcon(iconSelected);
	    	markers[i].setZIndex(2147480001);
        }
    });
}

function mapResetIcons() {
  $.each(markers, function(i,val) {
    markers[i].setIcon(icon);
    var markerZIndex = markers[i].getZIndex()
    if (markerZIndex>2147480000) {
	    markerZIndex = 2147480000;
    	markers[i].setZIndex(markerZIndex);
    }
  });
}

//user_id.id comes from main_graph
$.getJSON($base_url + "/api/get_places.php?user_id="+user_id.id, function( data ) {
  data_places = data;
  /* console.log(data_places); */

  var latLngCenter = new google.maps.LatLng( data['center'][0], data['center'][1] );
  map.setCenter(latLngCenter);

  $.each(data_places['places'], function(i,val) {
    myLatLng = new google.maps.LatLng( val['lat'], val['lon'] );
    marker = new google.maps.Marker( {position: myLatLng, map: map, icon: icon});
    markers.push(marker);
    latlng.push(myLatLng);
  });


  // Adjust map to fit bounds
  var latlngbounds = new google.maps.LatLngBounds();
  for (var i = 0; i < latlng.length; i++) {
    latlngbounds.extend(latlng[i]);
  }
  map.fitBounds(latlngbounds);
});

google.maps.event.addDomListener(window, 'load', initialize); 

function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(37.8651879418, -122.2823873959),
          zoom: 8,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function addTimeRangeToMap() {
	$.getJSON($base_url + "/api/get_places.php?user_id="+user_id.id+"&start_time="+startDateEpoc+"&end_time="+endDateEpoc, function( data ) {
		range_latlng = [];
		data_places = data;
		/* console.log(data_places); */
		
		var latLngCenter = new google.maps.LatLng( data['center'][0], data['center'][1] );
		map.setCenter(latLngCenter);
		
		$.each(data_places['places'], function(i,val) {
			latLng = new google.maps.LatLng( val['lat'], val['lon'] );
//			marker = new google.maps.Marker( {position: myLatLng, map: map, icon: icon});
//			markers.push(marker);
			range_latlng.push(latLng);
		});
		
		// Adjust map to fit bounds
		var latlngbounds = new google.maps.LatLngBounds();
		for (var i = 0; i < range_latlng.length; i++) {
			latlngbounds.extend(range_latlng[i]);
		}
		map.fitBounds(latlngbounds);
	});
	
}

function addPathsToMap() {
	// console.log($base_url + "/api/get_paths.php?user_id="+user_id.id);
	// download path data
	$.getJSON($base_url + "/api/get_paths.php?user_id="+user_id.id, function( data ) {
	//console.log(data);
		for (var i=0; i<data.length; i++) {
			var path = data[i];
//			 console.log(path['path_id']);
		    /* path = {path_id:
		    	activity:
		    	points:[{
		    			lat	:	37.8745386015
		    			lon	:	-122.258796073
		    			time	:	1405042818
		    			
		    			},...]}
		    */
		    var pathCoordinates = [];
		    for (var j=0; j<path['points'].length; j++) {
		    	point = path['points'][j];
		    	pathCoordinates.push(new google.maps.LatLng(point['lat'],point['lon']));
		    }
		    var pathPolyLine = new google.maps.Polyline({
		    	path: pathCoordinates,
		    	map: map,
		    	geodesic: true,
		    	strokeColor: '#FF0000',
		    	strokeOpacity: 1.0,
		    	strokeWeight: 1
		    });
		}
		
	});
}

addPathsToMap();