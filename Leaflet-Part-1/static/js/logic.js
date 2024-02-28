// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add the base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Load earthquake data directly using Leaflet's L.geoJSON()
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Define a function to set marker size based on magnitude
    function markerSize(magnitude) {
      return magnitude * 5;
    }

    // Define a function to set marker color based on depth
    function markerColor(depth) {
      if (depth < 50) return 'lightgreen';
      else if (depth < 100) return 'green';
      else if (depth < 200) return 'orange';
      else if (depth < 300) return 'red';
      else return 'darkred';
    }

    // Create a Leaflet GeoJSON layer
    var geoJsonLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var mag = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        return L.circleMarker(latlng, {
          radius: markerSize(mag),
          fillColor: markerColor(depth),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`<b>${feature.properties.title}</b><br>Magnitude: ${mag}<br>Depth: ${depth} km`);
      }
    });

    // Add GeoJSON layer to the map
    geoJsonLayer.addTo(map);
  })
  .catch(error => {
    console.error('Error loading GeoJSON data:', error);
  });

// Add legend
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<div class="legend-title">Legend</div>';
    div.innerHTML += '<div class="legend-item"><span style="background: lightgreen; width: 20px; height: 20px; display: inline-block;"></span> Depth &lt; 50 km</div>';
    div.innerHTML += '<div class="legend-item"><span style="background: green; width: 30px; height: 30px; display: inline-block;"></span> Depth 50 - 100 km</div>';
    div.innerHTML += '<div class="legend-item"><span style="background: orange; width: 40px; height: 40px; display: inline-block;"></span> Depth 100 - 200 km</div>';
    div.innerHTML += '<div class="legend-item"><span style="background: red; width: 50px; height: 50px; display: inline-block;"></span> Depth 200 - 300 km</div>';
    div.innerHTML += '<div class="legend-item"><span style="background: darkred; width: 60px; height: 60px; display: inline-block;"></span> Depth &gt; 300 km</div>';
    div.innerHTML += '<div class="legend-item"><svg width="20" height="20"><circle cx="10" cy="10" r="10" fill="none" stroke="#000" stroke-width="1"></circle></svg> Marker Size</div>';
    return div;
  };

legend.addTo(map);
