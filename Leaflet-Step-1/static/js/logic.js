var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

//Create map
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
});

lightmap.addTo(myMap); 

//function createFeatures
//for each features
d3.json(queryURL).then(function(earthquakeData) {
    
    var features = earthquakeData.features;
    var properties = earthquakeData.features.properties;
    var geometry = earthquakeData.features.geometry;
    //console.log(earthquakeData.features)
    //var depth = geometry.coordinates[2];
    var depth = 0;
    
    for (var i = 0; i < features.length; i++) {
        //console.log(features[i].geometry.coordinates[2]);
        var depth = +features[i].geometry.coordinates[2];
        var lat = +features[i].geometry.coordinates[1];
        var lon = +features[i].geometry.coordinates[0];
        var mag = +features[i].properties.mag;

        //Conditions for colors
        var color = "";
        if (depth > 90) {
            color = "#28B463";
        }
        else if (depth > 70) { 
            color = "#DAFF33";
        }
        else if (depth > 50) {
            color = "#FAD7A0";
        }
        else if (depth > 30) {
            color = "#F5B041";
        }
        else if (depth > 10) {
            color = "#DC7633";
        }
        else {
            color = "#C0392B";
        };

        //Info variables
        var title = features[i].properties.title;
        var place = features[i].properties.place;

        //Add circles to map
        L.circleMarker([lat, lon], {
            fillOpacity: 1,
            fillColor: color,
            color: "black",
            radius: mag * 4,
            weight: .5
        }).bindPopup("<h2>" + title + 
        "</h2> <hr> <h3>Magnitude: " + mag + "</h3>" +
        "<h3>Location: " + place + "</h3>" +
        "<h3>Coordinates: [" + lat + " , " + lon + "]</h3>").addTo(myMap);

    };
 
});


function getColor(depth) {
    return depth > 90 ? '#28B463' :
           depth > 70  ? '#DAFF33' :
           depth > 50  ? '#FAD7A0' :
           depth > 30  ? '#F5B041' :
           depth > 10  ? '#DC7633' :
           depth > -10 ? '#C0392B' :
                      '#FFEDA0';
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);