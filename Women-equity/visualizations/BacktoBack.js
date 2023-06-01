import * as d3 from 'd3';
import {
  GLOBAL
} from '../src/global.js';

class BacktoBack {
  constructor(configBackToBack, configData, data) {
    this.data = data;

    this.configBackToBack = {
      parentElement: configBackToBack.parentElement || '#vizBacktoBack',
      widthTotal: configBackToBack.width || window.innerWidth * 0.75,
      heightTotal: configBackToBack.height || window.innerHeight * 0.5,
      margin: configBackToBack.margin || {
        top: 20,
        right: 10,
        bottom: 30,
        left: 10
      },
      colors: configBackToBack.colors || colors,
      colorScale: configBackToBack.colorScale || ['#8be9fd', '#ff79c6', '#50fa7b', '#ffb86c', '#f8f8f2', '#f1fa8c', '#ff5555'],
      boundedWidth: undefined,
      boundedHeight: undefined,
      leftPart: configBackToBack.leftPart || {
        width: window.innerWidth / 4,
        translateFromStart: 0,
      },
      rightPart: configBackToBack.rightPart || {
        width: (window.innerWidth / 4) * 2,
        translateFromStart: (window.innerWidth / 4) * 2,
      },
    }

    this.configData = {
      bandArray: configData.bandArray || ['South Asia', 'Europe & Central Asia', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'High income: OECD', 'East Asia & Pacific'].sort(),
      leftPart: configData.leftPart || {

      },
      rightPart: configData.rightPart || {

      }
    }


    this.init();
  }

  init() {
    const that = this;
    // Calculate the inner bounds
    that.configBackToBack.boundedWidth =
      that.configBackToBack.widthTotal - that.configBackToBack.margin.left - that.configBackToBack.margin.right;
    that.configBackToBack.boundedHeight =
      that.configBackToBack.heightTotal - that.configBackToBack.margin.top - that.configBackToBack.margin.bottom;

    // Initialize the scales
    that.xScaleLeft = d3.scaleLinear().range([that.boundedWidth / 3, 0]); // 33% of the width for left viz (17% for label)
    that.xScaleRight = d3.scaleLinear().range([that.boundedWidth / 2, that.boundedWidth]); // 50% for right viz

    that.yScale = d3
      .scaleBand()
      .range([that.configBackToBack.boundedHeight, 0])
      .paddingInner(0.3);


    // Initialize the axes
    //that.yAxis = d3.axisLeft(that.yScale).ticks(6);
    that.yAxis = d3.axisLeft(that.yScale).ticks(that.configData.bandArray);

    // Initialize the svg
    that.svg = d3
      .select(that.configBackToBack.parentElement)
      .append("svg")
      .attr("width", that.configBackToBack.width)
      .attr("height", that.configBackToBack.height);

    // Initialize the drawing area
    that.viz = that.svg.append("g").attr(
      "transform",
      `translate(
                  ${that.configBackToBack.margin.left}, 
                  ${that.configBackToBack.margin.top}
                  )`
    );

    /**** STATIC ELEMENT ****/
    that.yAxisG = that.viz.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${that.configBackToBack.boundedWidth/3}, 0)`);

  }

  update() {
    const that = this;

    that.colorAccessor = (d) => d[that.configData.leftPart.dataAccessors.color];
    that.xAccessor = (d) => d[that.configData.leftPart.dataAccessors.x];
    that.yAccessor = (d) => d[that.configData.leftPart.dataAccessors.y];

    // Set the domain for the Scales
    that.yScale.domain(that.configData.bandArray);
    that.xScaleLeft.domain([0, that.configData.leftPart.maxValue])

    // colorScale
    if (that.configBackToBack.colorScale) {
      that.colorScale = d3.scaleOrdinal()
        .range(that.configBackToBack.colorScale)
        .domain(that.configData.bandArray);
    }

    this.render()
  }

  render() {
    const that = this;

    // Create the bars
    const bars = that.viz
      .selectAll("rect")
      .data(that.data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        console.log(that.xScaleLeft(d.val))
        return that.xScaleLeft(d.val)
      })
      .attr("y", (d) => that.yScale(d.val))
      .attr('width', that.yScale.bandwidth())
      .attr('height', d => that.configBackToBack.boundedHeight - that.yScale(d.val))
  }

  /**** HELPER FUNCTION ****/
}

export default BacktoBack