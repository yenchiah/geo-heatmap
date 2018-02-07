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

Remember to replace the [YOUR API KEY] with your key. The key provided in this repository is restricted to demo purposes. Second, to create the heatmap, pass in the DOM container id and the following settings to create a heatmap with single color scale:
```HTML
var settings = {
  zipcode_bound_geoJson: data["zipcode_bound_geoJson"],
  zipcode_bound_info: data["zipcode_bound_info"],
  zipcode_metadata: zipcode_metadata,
  threshold_metadata: 0,
  lambda: -1
};
geo_heatmap = new edaplotjs.GeoHeatmap("#map-container", settings);
```

For creating a map with a d3 color scale and custom info window, use the following settings:
```HTML
var settings_2 = {
  zipcode_bound_geoJson: data["zipcode_bound_geoJson"],
  zipcode_bound_info: data["zipcode_bound_info"],
  zipcode_metadata: zipcode_metadata,
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
    html += "    <td>Custom Data: " + zipcode_metadata[zipcode] + "</td>";
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
```

The following sections show parameters that you can specify in "settings" and the public methods.

# Settings

under construction...
