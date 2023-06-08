import * as d3 from 'd3';
import {
  GLOBAL
} from '../src/global.js';

class Barchart {
  constructor(configBarchart, configData, data) {
    this.data = data

    this.configBarchart = {
      parentElement: configBarchart.parentElement || '#vizBarchart',
      width: configBarchart.width || window.innerWidth * 0.7,
      height: configBarchart.height || window.innerHeight * 0.55,
      margin: configBarchart.margin || {
        top: 20,
        right: 35,
        bottom: 35,
        left: 20
      },
      colors: configBarchart.colors || colors,
      colorScale: configBarchart.colorScale,
      boundedWidth: configBarchart.boundedWidth || undefined,
      boundedHeight: configBarchart.boundedHeight || undefined,
    };

    this.configData = {
      xAxisTicks: configData.xAxisLabel || 'Region',
      yAxisTicks: configData.yAxisLabel || '%',
      maxValue: configData.maxValue || 100,
      bandArray: configData.bandArray || ['South Asia', 'Europe & Central Asia', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'High income: OECD', 'East Asia & Pacific'].sort(),
      dataAccessors: configData.dataAccessors || {
        color: 'key',
        x: 'key',
        y: 'val',
      }
    }

    this.init(); // Create the chart
  }

  init() {
    const that = this; // so we can still reference the this of the class inside of the functions

    // Calculate the inner bounds
    that.configBarchart.boundedWidth =
      that.configBarchart.width - that.configBarchart.margin.left - that.configBarchart.margin.right;
    that.configBarchart.boundedHeight =
      that.configBarchart.height - that.configBarchart.margin.top - that.configBarchart.margin.bottom;

    // Initialize the scales
    that.yScale = d3.scaleLinear().range([that.configBarchart.boundedHeight, 0]);

    // Using a scale band in order to distribute the bars along the visual available space
    that.xScale = d3
      .scaleBand()
      .range([0, that.configBarchart.boundedWidth])
      .paddingInner(0.3);

    // Initialize the axes
    that.yAxis = d3.axisLeft(that.yScale).ticks(6);

    that.xAxis = d3.axisBottom(that.xScale).ticks(that.configData.bandArray);

    // Initialize the svg
    that.svg = d3
      .select(that.configBarchart.parentElement)
      .append("svg")
      .attr("width", that.configBarchart.width)
      .attr("height", that.configBarchart.height);

    // Initialize the drawing area
    that.viz = that.svg.append("g").attr(
      "transform",
      `translate(
                ${that.configBarchart.margin.left}, 
                ${that.configBarchart.margin.top}
                )`
    );

    /**** STATIC ELEMENT ****/
    that.xAxisG = that.viz
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${that.configBarchart.boundedHeight})`);

    that.yAxisG = that.viz.append("g").attr("class", "axis y-axis");
  }

  update() {
    const that = this;

    that.colorAccessor = (d) => d[that.configData.dataAccessors.color];
    that.xAccessor = (d) => d[that.configData.dataAccessors.x];
    that.yAccessor = (d) => d[that.configData.dataAccessors.y];

    // Set the domain for the Scales
    that.xScale.domain(that.configData.bandArray);
    that.yScale.domain([0, that.configData.maxValue])

    // colorScale
    if (that.configBarchart.colorScale) {
      that.colorScale = d3.scaleOrdinal()
        .range(that.configBarchart.colorScale)
        .domain(that.configData.bandArray);
    }

    this.render(); // trigger the render of the visualization
  }

  /**
   * Render the visualization
   */

  render() {
    const that = this;
    

    // Create the bars
    const bars = that.viz
      .selectAll("rect")
      .data(that.data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => that.xScale(that.xAccessor(d)))
      .attr("y", (d) => that.yScale(0))
      .attr("height", 0)
      .attr('width', that.xScale.bandwidth());
      if (that.configBarchart.colorScale) {
        bars.attr('fill', d => that.colorScale(that.colorAccessor(d)))
      } else {
        bars.attr('fill', that.configBarchart.colors.orange)
      }

    bars.transition()
      .duration(700)
      .delay(150)
      .delay((d, i) => (i * 75))
      .attr('height', d => that.configBarchart.boundedHeight - that.yScale(that.yAccessor(d)))
      .attr("y", (d) => that.yScale(that.yAccessor(d)))


    // Create Axis
    that.xAxisG
      .transition()
      .duration(600)
      .call(that.xAxis)
      .call((g) => g.select(".domain").remove()); // get rid of the axis line and just use the markers and grid lines

    that.yAxisG
      .transition()
      .duration(600)
      .call(that.yAxis)
      .call((g) => g.select(".domain").remove()); // get rid of the axis line and just use the markers and grid lines

    if (!GLOBAL.currentIndicator.name) {
      document.getElementById('questions').style.display = 'none';
    }

    // on click event
    bars.on('click', function (event) {

      const questionsDiv = document.querySelector('#questions')

      that.updateCurrentIndicator(this)
      GLOBAL.currentIndicator.updateHtmlQuestions(questionsDiv)
      questionsDiv.style.display = 'block'

    })
  }


  updateCurrentIndicator(sel) {
    GLOBAL.currentIndicator.name = sel.__data__.key;
    GLOBAL.currentIndicator.questions = (GLOBAL.currentCountry.dataQuestions[GLOBAL.currentIndicator.name])
  }
}

export default Barchart;