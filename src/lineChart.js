"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var LineChart = require('react-d3-basic').LineChart;

(function() {

  var generalChartData = require('./data/user.json');

  var chartSeries = [
      {
        field: 'age',
        name: 'Age',
        color: '#ff7f0e',
        style: {
          "stroke-width": 2,
          "stroke-opacity": .2,
          "fill-opacity": .2
        }
      }
    ],
    x = function(d) {
      return d.index;
    }

  ReactDOM.render(
    <LineChart
      width= {600}
      height= {300}
      data= {generalChartData}
      chartSeries= {chartSeries}
      x= {x}
    />
  , document.getElementById('data_line')
  )
})()