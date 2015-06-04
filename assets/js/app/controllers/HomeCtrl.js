RiskCityApp.controller('HomeCtrl',['$scope','NeighborsService',function($scope,NeighborsService){
  $( document ).ready(function(){
    $.ajax({
      dataType: "json",
      url: '/js/app/data/_geohoods.geojson',
      success: function load(data) {
        hoods = data
        myLayer.setGeoJSON(hoods)
        console.log("adding all hoods: ", hoods)
        return hoods
      }
    });

    var hoods = {}
    console.log("checking neighbors: ", myLayer)

    //Map Stuff!
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFrZXJvaHIiLCJhIjoiNmQxZDQ2NTliYjM5NDQ1ZDNiMDc4ZjdiYTA4YjlkM2QifQ.DkjkobnU0AM9BkDy-CE9CQ';
    var click = document.getElementById('click'),
      mousemove = document.getElementById('mousemove');
    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([47.6097,-122.3331], 11)
      // .featureLayer.setGeoJSON(geojson);
    var myLayer = L.mapbox.featureLayer().addTo(map);

    var markerRed = L.marker(new L.LatLng(47.65776,-122.36345), {
      icon: L.mapbox.marker.icon({
          "title": "Jake",
          'description':"red",
          'marker-color': 'ff8888',
          'marker-symbol': 'pitch',
          'marker-size': 'small'
      }),
      draggable: true,
      clickable: true
    });
   var markerBlue = L.marker(new L.LatLng(47.66776,-122.36345), {
    icon: L.mapbox.marker.icon({
        "title": "Annie",
        'description':"blue",
        'marker-color': '0928CD',
        'marker-symbol': 'pitch',
        'marker-size': 'small'
    }),
    draggable: true,
    clickable: true
  });

    markerBlue.addTo(map)
      .on('dragend', function(e) {
        var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
        if (layer.length) {
          console.log("changing to blue")
          layer[0].feature.properties['fill'] = '#0928CD';
          myLayer.setGeoJSON(hoods)
        } else {
          console.log("marker is not in a neighborhood.")
        }
      });
    var position = {}
    var currentHood = {}
    var coords = []
    markerRed.addTo(map)
      .on('mousedown',function(e){
        position = this.getLatLng()
        currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
        neighbors = currentHood[0].feature.neighbors
        console.log("neighbors: ",neighbors);
      })
      .on('dragend', function(e) {
        var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
        if (layer.length) {
          var adjacent = false
          console.log("layer neighbors", layer[0].feature.properties.name)
          newHood = layer[0].feature.properties.name
          for (var k in neighbors) {
            if (neighbors[k] == newHood){
              adjacent = true
            }
          }
          if (adjacent) {
            console.log("neighbor!")
            layer[0].feature.properties['fill'] = '#ff8888';
            myLayer.setGeoJSON(hoods)
            adjacent = false
          } else {
            console.log("not a neighbor!!!!")
            this.setLatLng(position);
            myLayer.setGeoJSON(hoods)
          }
        } else {
          console.log("marker is not in a neighborhood.")
          this.setLatLng(position);
          myLayer.setGeoJSON(hoods)
        }
      });

    map.on('mousemove click', function(e) {
        window[e.type].innerHTML = e.containerPoint.toString() + ', ' + e.latlng.toString();
    });
  });
}]);
