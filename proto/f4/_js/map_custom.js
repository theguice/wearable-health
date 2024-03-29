var data_places = [];
var map;
var latlng = [];
var markers = [];
var icon = {
  path: google.maps.SymbolPath.CIRCLE,
  strokeColor: 'gold',
  scale: 3
};
var iconSelected = {
  path: google.maps.SymbolPath.CIRCLE,
  strokeColor: 'red',
  scale: 6
};

function mapHighlightPoint(time) {
    var d = new Date(time);
    epoch = d.getTime() / 1000;
    $.each(data_places['places'], function(i,val) {
        if (epoch > parseInt(val['time_start']) && epoch < parseInt(val['time_end'])) {
            mapResetIcons();
	    markers[i].setIcon(iconSelected);
        }
    });
}
function mapResetIcons() {
  $.each(markers, function(i,val) {
    markers[i].setIcon(icon);
  });
}

$.getJSON( "get_places.php?user_id=1", function( data ) {
  data_places = data;
  console.log(data_places);

  var myLatLng = new google.maps.LatLng( data['center'][0], data['center'][1] );
  map.setCenter(myLatLng);

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
