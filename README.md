# edaplotjs.GeoHeatmap

Demo: https://yenchiah.github.io/geo-heatmap/GeoHeatmap.html

This JavaScript library is for creating an interactive geographical heatmap. This library uses Google map's [data layer](https://developers.google.com/maps/documentation/javascript/examples/layer-data-dynamic) to show GeoJSON zipcode boundaries. These zipcode boundaries are processed and downloaded from [data.gov](https://catalog.data.gov/dataset/zip-codetabilation-area-boundaries/resource/ea476dcb-4846-4242-9fb3-d41afb13bf52). The polygons on the map can be colored by using [d3-scale](https://github.com/d3/d3-scale). One example that uses this library is the [Environmental Health Channel](https://cmu-create-lab.github.io/ehp-channel/web/visualization.html).

# Dependencies
jQuery (necessary, https://jquery.com/)  
d3 (optional, version 3, https://d3js.org/)

# Usage
First, get a [Google Map JavaScript API key](https://developers.google.com/maps/documentation/javascript/get-api-key), then include the following lines in the \<head\> tag of html file:
```HTML
<link href="GeoHeatmap.css" media="screen" rel="stylesheet" type="text/css"/>
<script src="jquery.min.js" type="text/javascript"></script>
<script src="d3.v3.min.js" type="text/javascript"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=[YOUR API KEY]"></script>
<script src="GeoHeatmap.js" type="text/javascript"></script>
```

Remember to replace the [YOUR API KEY] with your key. The key provided in this repository is restricted to demo purposes. Second, you need to prepare three json files, zipcode_bound_geoJson, zipcode_bound_info, and zipcode_metadata. See the example files in this repository for their formats. For zipcode_bound_geoJson and zipcode_bound_info, you need to download the ZCTA5 json file from [data.gov](https://catalog.data.gov/dataset/zip-codetabilation-area-boundaries/resource/ea476dcb-4846-4242-9fb3-d41afb13bf52) and choose the zipcode boundaries that you want for the heatmap. Then, use jQuery to load these data simultaneously:
```JavaScript
var data = {};
// Start loading data simultaneously
$.when(
  // Load the GeoJSON that contains the zipcode boundaries
  $.getJSON("zipcode_bound_geoJson.json", function (json) {
    data["zipcode_bound_geoJson"] = json;
  }).fail(function (response) {
    console.log("server error when loading zip code bound GeoJson: ", response);
  }),
  // Load the table that maps zipcodes, bounds, and center positions
  $.getJSON("zipcode_bound_info.json", function (json) {
    data["zipcode_bound_info"] = json["data"];
  }).fail(function (response) {
    console.log("server error when loading zipcode bound information:", response);
  }),
  // Load metadata
  $.getJSON("zipcode_metadata.json", function (json) {
    data["zipcode_metadata"] = json;
  }).fail(function (response) {
    console.log("server error when loading zipcode metadata:", response);
  })
).then(function () {
  init(data);
});
```

Third, to create the heatmap, pass in the DOM container id and the following settings to create a heatmap with a single color scale:
```JavaScript
function init(data) {
  var settings = {
    zipcode_bound_geoJson: data["zipcode_bound_geoJson"],
    zipcode_bound_info: data["zipcode_bound_info"],
    zipcode_metadata: data["zipcode_metadata"],
    threshold_metadata: 0,
    lambda: -1
  };
  geo_heatmap = new edaplotjs.GeoHeatmap("#map-container", settings);
}
```

For creating a map with a d3 color scale and custom info window, use the following settings:
```JavaScript
function init(data) {
  var settings = {
    zipcode_bound_geoJson: data["zipcode_bound_geoJson"],
    zipcode_bound_info: data["zipcode_bound_info"],
    zipcode_metadata: data["zipcode_metadata"],
    color_scale: d3.scale.linear().domain([0, 0.33, 0.66, 1]).range(["#00a511", "#fff200", "#ff6200", "#ff0000"]).interpolate(d3.interpolateLab),
    max_percentile: 0.99,
    min_percentile: 0.05,
    info_window_html_layout: function (zipcode) {
      var html = "";
      html += "<table>";
      html += "  <tr>";
      html += "    <td>Zipcode: " + zipcode + "</td>";
      html += "  </tr>";
      html += "  <tr>";
      html += "    <td>Custom Data: " + data["zipcode_metadata"][zipcode] + "</td>";
      html += "  </tr>";
      html += "</table>";
      return html;
    },
    mouseover_callback: function (zipcode) {
      console.log("mouseover on zipcode: " + zipcode);
    },
    mouseout_callback: function (zipcode) {
      console.log("mouseout on zipcode: " + zipcode);
    },
    info_window_domready_callback: function (zipcode) {
      console.log("info window domready for zipcode: " + zipcode);
    },
    info_window_closeclick_callback: function (zipcode) {
      console.log("info window closeclick for zipcode: " + zipcode);
    }
  };
  geo_heatmap = new edaplotjs.GeoHeatmap("#map-container", settings);
}
```

The following sections show parameters that you can specify in "settings" and the public methods.

# Settings

### "zipcode_metadata"
The json file for visualizing the zipcode regions. The format is {"zipcode": value}. Values represent data in the zipcode, for instance, number of people. See file [zipcode_metadata](https://github.com/yenchiah/geo-heatmap/blob/master/zipcode_metadata.json) for an example.
```JavaScript
settings["zipcode_metadata"] = {"15213": 25, "15232": 10}
```

### "zipcode_bound_geoJson"
The GeoJSON file that stores the zipcode boundaries (polygons). See file [zipcode_bound_geoJson](https://github.com/yenchiah/geo-heatmap/blob/master/zipcode_bound_geoJson.json) for an example. You need to select the boundaries from the [ZCTA5](https://catalog.data.gov/dataset/zip-codetabilation-area-boundaries/resource/ea476dcb-4846-4242-9fb3-d41afb13bf52).
```JavaScript
settings["zipcode_bound_geoJson"] = zipcode_bound_geoJson
```

### "zipcode_bound_info"
The json file that stores the mapping of zipcode, bounding boxes, and center positions. The format is "zipcode": ["min_lng", "min_lat", "max_lng", "max_lat", "center_lng", "center_lat"], where lat means latitude, lng means longitude. See file [zipcode_bound_info](https://github.com/yenchiah/geo-heatmap/blob/master/zipcode_bound_info.json) for an example.
```JavaScript
settings["zipcode_bound_info"] = {
  "15202": [-80.108617, 40.482170, -80.033285, 40.521929, -80.070951, 40.5020495],
  "15205": [-80.172815, 40.408126, -80.040698, 40.459977, -80.106757, 40.4340515]}
```

### "init_map_zoom"
The initial zoom level of the Google map.
```JavaScript
settings["init_map_zoom"] = 12
```

### "init_map_center"
The initial center location of the Google map in latitude and longitude.
```JavaScript
settings["init_map_zoom"] = {lat: 40.43, lng: -79.93}
```

### "color_single"
The base color to fill in the zipcode regions when there is no color scale.
```JavaScript
settings["color_single"] = "#ff0000"
```

### "color_scale"
The d3 color scale object for rendering the color of zipcode regions. This feature requires [d3.js](https://d3js.org/) version 3.
```JavaScript
settings["color_scale"] = d3.scale.linear().domain([0, 0.33, 0.66, 1]).range(["#00a511", "#fff200", "#ff6200", "#ff0000"]).interpolate(d3.interpolateLab)
```

### "color_opacity"
The opacity of zipcode regions, ranging from 0 to 1. If there is no zipcode metadata, all zipcode regions will have opacity equal to this setting. If there is both zipcode metadata and color scale, the color of zipcode regions is determined by the scale and the opacity is defined by this setting. This setting does not work when there is zipcode metadata but no color scale, where the opacity is automatically computed based on the zipcode metadata.
```JavaScript
settings["color_opacity"] = 0.7
```

