/*************************************************************************
 * GitHub: https://github.com/yenchiah/geo-heatmap
 * Version: v1.17
 *************************************************************************/

(function () {
  "use strict";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Create the class
  //
  var ColorScaleLegend = function (container_selector, settings) {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Variables
    //
    // The d3.js color scale object for rendering the color legend
    var color_scale = settings["color_scale"];

    // The text for the top and bottom of the color bar
    var top_text = typeof settings["top_text"] === "undefined" ? "high" : settings["top_text"];
    var bottom_text = typeof settings["bottom_text"] === "undefined" ? "low" : settings["bottom_text"];

    // DOM objects
    var $container = $(container_selector);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Private methods
    //
    function init() {
      addLegend();
    }

    function addLegend() {
      // Add DOM element
      var $legend = $('<div class="color-scale-legend"></div>');
      var $top_text = $('<div class="legend-top-text legend-text">' + top_text + '</div>');
      var $bottom_text = $('<div class="legend-bottom-text legend-text">' + bottom_text + '</div>');
      var uuid = uuidv4();
      $legend.append($top_text);
      $legend.append($bottom_text);
      $container.append($legend);

      // Parameters
      var w = $legend.width();
      var h = $legend.height();
      if (typeof w === "undefined" || w == 0) {
        w = 40;
      }
      if (typeof h === "undefined" || h == 0) {
        h = 150;
      }
      var center_x = w / 2;
      var margin_t = 25; // distance between color bar and top border
      var margin_b = 23; // distance between color bar and bottom border
      var bar_h = h - margin_t - margin_b;
      var bar_w = 10;

      // Add the legend container
      var svg = d3.select(container_selector + " .color-scale-legend")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("g");

      // Add the linear gradient
      svg.append("defs")
        .append("linearGradient")
        .attr("id", uuid)
        .attr("x1", "0%").attr("y1", "100%")
        .attr("x2", "0%").attr("y2", "0%")
        .selectAll("stop")
        .data(color_scale.range())
        .enter()
        .append("stop")
        .attr("offset", function (d, i) {
          return i / (color_scale.range().length - 1);
        })
        .attr("stop-color", function (d) {
          return d;
        });

      // Add the rectangle
      svg.append("rect")
        .attr("class", "legend-rect")
        .attr("x", center_x - bar_w / 2)
        .attr("y", margin_t)
        .attr("width", bar_w)
        .attr("height", bar_h)
        .style("fill", "url(#" + uuid + ")");
    }

    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Privileged methods
    //
    this.hide = function () {
      $container.css("visibility", "hidden");
    };

    this.show = function () {
      $container.css("visibility", "visible");
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Constructor
    //
    init();
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Register to window
  //
  if (window.edaplotjs) {
    window.edaplotjs.ColorScaleLegend = ColorScaleLegend;
  } else {
    window.edaplotjs = {};
    window.edaplotjs.ColorScaleLegend = ColorScaleLegend;
  }
})();