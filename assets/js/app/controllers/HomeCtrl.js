RiskCityApp.controller('HomeCtrl',['$scope','MarkerService',function($scope,MarkerService){
  $( document ).ready(function(){
    // var position = {}
    // var currentHood = {}
    // var coords = []
    // var hoods = {}
    var blue = "#0928CD"
    var red = "#DA0303"
    var blueHoods = []
    var redHoods = []
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
    var bounds = [[47.66293,-122.372036],[47.667557,-122.384555]]

    console.log("there goes the neighborhoodz!!!!");
    // MarkerService.checkHoods();

    //Map Stuff!
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFrZXJvaHIiLCJhIjoiNmQxZDQ2NTliYjM5NDQ1ZDNiMDc4ZjdiYTA4YjlkM2QifQ.DkjkobnU0AM9BkDy-CE9CQ';
    var click = document.getElementById('click'),
      mousemove = document.getElementById('mousemove');
    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([47.6097,-122.3331], 11)
      // .featureLayer.setGeoJSON(geojson);
    var myLayer = L.mapbox.featureLayer().addTo(map);
    L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);

    $scope.reset = function(){
      console.log("reset!!!");

      //loading New board
      $.ajax({
        dataType: "json",
        url: '/js/app/data/_all_hoods.geojson',
        success: function load(data) {
          var setupTurn = blue
          for (key in data){
            // player markers
            var marker = function(color) {

              L.marker(new L.LatLng(data[key][0],data[key][1]), {
                icon: L.mapbox.marker.icon({
                    "title": "Jake",
                    'description':color,
                    'marker-color': color,
                    'marker-symbol': 'pitch',
                    'marker-size': 'small'
                }),
                draggable: true,
                clickable: true
              })
              .on('add', function(e){
                var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
                layer[0].feature.properties['fill'] = color;
                myLayer.setGeoJSON(hoods)
              }).addTo(map)
              .on('mousedown',function(e){
              position = this.getLatLng()
              currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
              neighbors = currentHood[0].feature.neighbors
              console.log("neighbors: ",neighbors);
              })
              .on('dragend', function(e) {
                var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
                console.log(layer[0].feature.properties.name + ": ",this.getLatLng())
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
                    layer[0].feature.properties['fill'] = color;
                    if (color == blue) {
                    blueHoods.push(newHood)
                    } else {
                    redHoods.push(newHood)
                    }
                    console.log("blue array",blueHoods)
                    console.log("red array",redHoods)

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
            }
            if (setupTurn == blue) {
              marker(blue);
              setupTurn = red;
            } else if (setupTurn == red) {
              marker(red);
              setupTurn = "default";
            } else if (setupTurn == "default") {
            // neutral units
              L.marker(new L.LatLng(data[key][0],data[key][1]), {
                icon: L.mapbox.marker.icon({
                  "title": "Neutral",
                  'description': "Minding its own business",
                  'marker-size': 'small',
                  'marker-color': '#1E1E1E',
                  'marker-symbol': 'embassy'
                }),
                draggable: false,
                clickable: true
              }).addTo(map)
              setupTurn = blue
            }
          }
        }
      });
    }






    // marker(blue);
    // marker(red);
    // marker(red);
    // marker(red);
    // marker("red");
  //  var markerBlue = L.marker(new L.LatLng(47.66776,-122.36345), {
  //   icon: L.mapbox.marker.icon({
  //       "title": "Annie",
  //       'description':"blue",
  //       'marker-color': '0928CD',
  //       'marker-symbol': 'pitch',
  //       'marker-size': 'small'
  //   }),
  //   draggable: true,
  //   clickable: true
  // });

    // markerBlue.addTo(map)
    //   .on('dragend', function(e) {
    //     var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
    //     if (layer.length) {
    //       console.log("changing to blue")
    //       layer[0].feature.properties['fill'] = color;
    //       myLayer.setGeoJSON(hoods)
    //     } else {
    //       console.log("marker is not in a neighborhood.")
    //     }
    //   });

    // markerRed.addTo(map)
    //   .on('mousedown',function(e){
    //     position = this.getLatLng()
    //     currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
    //     neighbors = currentHood[0].feature.neighbors
    //     console.log("neighbors: ",neighbors);
    //   })
    //   .on('dragend', function(e) {
    //     var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
    //     if (layer.length) {
    //       var adjacent = false
    //       console.log("layer neighbors", layer[0].feature.properties.name)
    //       newHood = layer[0].feature.properties.name
    //       for (var k in neighbors) {
    //         if (neighbors[k] == newHood){
    //           adjacent = true
    //         }
    //       }
    //       if (adjacent) {
    //         console.log("neighbor!")
    //         layer[0].feature.properties['fill'] = '#ff8888';
    //         myLayer.setGeoJSON(hoods)
    //         adjacent = false
    //       } else {
    //         console.log("not a neighbor!!!!")
    //         this.setLatLng(position);
    //         myLayer.setGeoJSON(hoods)
    //       }
    //     } else {
    //       console.log("marker is not in a neighborhood.")
    //       this.setLatLng(position);
    //       myLayer.setGeoJSON(hoods)
    //     }
      // });

    map.on('mousemove click', function(e) {
        window[e.type].innerHTML = e.containerPoint.toString() + ', ' + e.latlng.toString();
    });
  });
}]);
