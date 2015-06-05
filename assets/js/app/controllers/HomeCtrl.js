RiskCityApp.controller('HomeCtrl',['$scope','MarkerService',function($scope,MarkerService){
  $( document ).ready(function(){
    var blue = "#0928CD"
    var red = "#DA0303"
    var blueHoods = []
    var redHoods = []
    var neutralHoods = []
    var currentHood = []
    var neighbors = []
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


    console.log("there goes the neighborhoodz!!!!");
    console.log("OnMap!!!!")

    // MarkerService.checkHoods();

    //Map Stuff!
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFrZXJvaHIiLCJhIjoiNmQxZDQ2NTliYjM5NDQ1ZDNiMDc4ZjdiYTA4YjlkM2QifQ.DkjkobnU0AM9BkDy-CE9CQ';
    var click = document.getElementById('click'),
      mousemove = document.getElementById('mousemove');
    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([47.6097,-122.3331], 11)
      // .featureLayer.setGeoJSON(geojson);
    var myLayer = L.mapbox.featureLayer().addTo(map);
    var marker = ""
    $scope.reset = function(){
      console.log("reset");
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          console.log("pray to the gods")
          map.removeLayer(layer);
       }
      });
      //loading New board
      $.ajax({
        dataType: "json",
        url: '/js/app/data/_all_hoods.geojson',
        success: function load(data) {
          var setupTurn = blue
          for (key in data){
            // player markers
            marker = function(color) {

            var mark = L.marker(new L.LatLng(data[key][0],data[key][1]), {
              icon: L.mapbox.marker.icon({
                "title": "Brave Soldier",
                'description':color,
                'marker-color': color,
                'marker-symbol': 'pitch',
                'marker-size': 'small'
              }),
              draggable: true,
              clickable: true,
              'name': MarkerService.getName()
            })
              .on('add', function(e){
                var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
                layer[0].feature.properties['fill'] = color;
                newHood = layer[0].feature.properties.name;
                layer[0].feature.occupied = color;
                layer[0].feature.units.push(mark._leaflet_id)
                // console.log("oh snap! ",layer[0].feature)
                if (color == blue) {
                  blueHoods.push(newHood)
                } else {
                  redHoods.push(newHood)
                }
                myLayer.setGeoJSON(hoods)
                // console.log("marker layer: ",mark);
              })
              mark.addTo(map)
              .on('mousedown',function(e){
              position = this.getLatLng()
              currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
              currentHood = currentHood[0].feature
              neighbors = currentHood.neighbors
              console.log(currentHood.properties.name + " units: ",currentHood.units)

              })
              .on('dragend', function(e) {
                var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
                if (layer.length) {
                  var adjacent = false
                  // console.log("layer name", layer[0].feature.properties.name)
                  // console.log("neighbors ", neighbors)
                  newHood = layer[0].feature
                  for (var k in neighbors) {
                    if (neighbors[k] == newHood.properties.name){
                      adjacent = true

                    }
                  }
                  if (adjacent) {
                    console.log("neighbor!");
                    if (currentHood.units.length = 0) {
                      this.setLatLng(position);
                      console.log('Must leave one unit behind')
                      myLayer.setGeoJSON(hoods);
                    } else {
                      if (color == blue) {
                        if (layer[0].feature.occupied == red || "neutral"){
                          //attacking
                          console.log(currentHood.properties.name +" is attacking "+ newHood.properties.name)

                          clearAttacker = currentHood.units.pop();
                          clearDefender = newHood.units.pop()
                          console.log("attacking loses: ",clearAttacker);
                          console.log("defending loses: ",clearDefender);
                          if (mark._leaflet_id == clearAttacker){
                            map.removeLayer(mark);
                          }
                          map.removeLayer(map._layers[clearDefender]);
                          myLayer.setGeoJSON(hoods)
                          if (newHood.units.length == 0) {
                            blueHoods.push(newHood.properties.name)
                            layer[0].feature.properties['fill'] = color;
                            layer[0].feature.occupied = color;
                            console.log("battle over")
                          }
                        } else {
                          layer[0].feature.units.push(mark._leaflet_id)
                          currentHood.units.splice(currentHood.units.indexOf(mark._leaflet_id),1)
                          myLayer.setGeoJSON(hoods)
                        }
                      } else if (color == red){
                        if (layer[0].feature.occupied == blue || "neutral") {
                          //attacking
                          console.log(currentHood.properties.name +" is attacking "+ newHood.properties.name)

                          clearAttacker = currentHood.units.pop();
                          clearDefender = newHood.units.pop()
                          console.log("attacking loses: ",clearAttacker);
                          console.log("defending loses: ",clearDefender);
                          if (mark._leaflet_id == clearAttacker){
                            map.removeLayer(mark);
                          }
                          map.removeLayer(map._layers[clearDefender]);
                          myLayer.setGeoJSON(hoods)
                          if (newHood.units.length == 0) {
                            redHoods.push(newHood.properties.name)
                            layer[0].feature.properties['fill'] = color;
                            layer[0].feature.occupied = color;
                            console.log("battle over")
                          }
                        } else {
                          layer[0].feature.units.push(mark._leaflet_id)
                          currentHood.units.splice(currentHood.units.indexOf(mark._leaflet_id),1)
                          myLayer.setGeoJSON(hoods)
                        }
                      }
                    }
                      // console.log("blue array",blueHoods)
                      // console.log("red array",redHoods)
                      // console.log("neutral array",neutralHoods)
                      layer[0].feature.units.push(mark._leaflet_id)
                      console.log(newHood.properties.name + " units: ", layer[0].feature.units)
                      console.log(currentHood.properties.name + " units: ",currentHood.units)
                      currentHood.units.splice(currentHood.units.indexOf(mark._leaflet_id),1)
                      console.log(currentHood.properties.name + " units: ",currentHood.units)
                      console.log(newHood.properties.name + " units: ", layer[0].feature.units)

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
              var mark = L.marker(new L.LatLng(data[key][0],data[key][1]), {
                icon: L.mapbox.marker.icon({
                  "title": "Innocent Bystander",
                  'description': "Minding its own business",
                  'marker-size': 'small',
                  'marker-color': '#1E1E1E',
                  'marker-symbol': 'embassy'
                }),
                draggable: false,
                clickable: true,
                'name': MarkerService.getName()
              }).on('add', function(e){
                setupTurn = blue
                var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
                newHood = layer[0].feature
                newHood.units.push(mark._leaflet_id)
                newHood.occupied = "neutral"
                neutralHoods.push(newHood.properties.name)
              })
              mark.addTo(map)
            }
          }
        }
      });
    }
    var addTroops = function(blueHoods,redHoods) {
      blueNum =  Math.round(blueHoods/3)
      redNum = Math.round(redHoods/3)
    }
    var reinforce = function(blueHoods,redHoods){
      addTroops(blueHoods,redHoods);
      var onMap = false;

      blueCounter = blueNum;
      redCounter = redNum;
      for (var i = 0; i < redNum; i++) {
        mark = L.marker(new L.LatLng(47.611 + Math.random() * .001, -122.385 + Math.random() * .001), {
          icon: L.mapbox.marker.icon({
            "title": "Brave Soldier",
            'description': red,
            'marker-color': red,
            'marker-symbol': 'pitch',
            'marker-size': 'small'
          }),
          draggable: true,
          clickable: true,
          'name': MarkerService.getName()
        })
        mark.addTo(map)
        .on('mousedown',function(e){
          position = this.getLatLng()
          if (blueCounter && redCounter < 1 ) {
            console. log("onMap",onMap)
            return onMap
          }
          if (onMap){
            currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
            currentHood = currentHood[0].feature
            neighbors = currentHood.neighbors
            console.log(currentHood.properties.name + " units: ",currentHood.units)
          }
        })
        .on('dragend', function(e) {
          var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
          if (layer.length) {
            var adjacent = false
            newHood = layer[0].feature
            if (onMap){
              for (var k in neighbors) {
                if (neighbors[k] == newHood.properties.name){
                  adjacent = true
                }
              }
            }
            if (newHood.occupied == red) {
              layer[0].feature.units.push(mark._leaflet_id)
              redCounter --
              console.log("red counter",redCounter);
              console.log(layer[0].feature.properties.name + " units: ",layer[0].feature.units)
              myLayer.setGeoJSON(hoods)
            } else {
              this.setLatLng(position);
              myLayer.setGeoJSON(hoods);
            }



          } else {
            console.log("marker is not in a neighborhood.")
            this.setLatLng(position);
            myLayer.setGeoJSON(hoods);
          }
        })
      };
      for (var i = 0; i < blueNum; i++) {

        mark = L.marker(new L.LatLng(47.603 + Math.random() * .001, -122.256 + Math.random() * .001), {
          icon: L.mapbox.marker.icon({
            "title": "Brave Soldier",

            'description': blue,
            'marker-color': blue,
            'marker-symbol': 'pitch',
            'marker-size': 'small'
          }),
          draggable: true,
          clickable: true,
          'name': MarkerService.getName()
        })
        mark.addTo(map)
        .on('mousedown',function(e){
          position = this.getLatLng()
          if (blueCounter && redCounter < 0) {
            console. log("onMap",onMap)
            return onMap
          }
          if (onMap){
            currentHood = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
            currentHood = currentHood[0].feature
            neighbors = currentHood.neighbors
            console.log(currentHood.properties.name + " units: ",currentHood.units)
          }
        })
        .on('dragend', function(e) {
          var layer = leafletPip.pointInLayer(this.getLatLng(), myLayer, true);
          if (layer.length) {
            var adjacent = false
            newHood = layer[0].feature
            if (onMap){
              for (var k in neighbors) {
                if (neighbors[k] == newHood.properties.name){
                  adjacent = true
                }
              }
            }
            if (newHood.occupied == blue) {
              layer[0].feature.units.push(mark._leaflet_id)
              blueCounter --
              console.log("blue counter",blueCounter);
              console.log(layer[0].feature.properties.name + " units: ",layer[0].feature.units)
              myLayer.setGeoJSON(hoods)
            } else {
              this.setLatLng(position);
              myLayer.setGeoJSON(hoods);
            }
          } else {
            console.log("marker is not in a neighborhood.")
            this.setLatLng(position);
            myLayer.setGeoJSON(hoods);
          }
        })

      };

    }

    var blueBounds = [[47.6145, -122.27165],[47.60061, -122.24625]]
    var redBounds = [[47.61588, -122.40417],[47.60339, -122.37122]]
    L.rectangle(blueBounds, {color: "#0928CD", weight: 1}).addTo(map);
    L.rectangle(redBounds, {color: "#DA0303", weight: 1}).addTo(map);



    $scope.checkStuff = function() {
      reinforce(blueHoods.length,redHoods.length)
      console.log("reinforcing")

    }
    // map.on('mousemove click', function(e) {
    //     window[e.type].innerHTML = e.containerPoint.toString() + ', ' + e.latlng.toString();
    // });
  });
}]);
