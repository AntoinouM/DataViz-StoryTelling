import * as d3 from 'd3';
import {
  GLOBAL
} from '../src/global.js';

class BacktoBack {
  constructor(configBackToBack, configData, data, dispatcher) {
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

    this.dispatcher = dispatcher;

    this.init();
  }

  init() {
    const that = this;
    that.offset = 80;
    // Calculate the inner bounds
    that.configBackToBack.boundedWidth =
      that.configBackToBack.widthTotal - that.configBackToBack.margin.left - that.configBackToBack.margin.right;
    that.configBackToBack.boundedHeight =
      that.configBackToBack.heightTotal - that.configBackToBack.margin.top - that.configBackToBack.margin.bottom;

    // initialize the area
    that.svg = d3.select(that.configBackToBack.parentElement)
      .append("svg")
      .attr("width", that.configBackToBack.widthTotal)
      .attr("height", that.configBackToBack.heightTotal)

    that.vizLeft = that.svg.append("g")
      .attr("class", "vizLeft")
      .attr(
        "transform",
        `translate(
                    ${that.configBackToBack.margin.left}, 
                    ${that.configBackToBack.margin.top}
                    )`
      );

    that.vizRight = that.svg.append("g")
      .attr("class", "vizRight")


    // Add X axis
    that.xLeft = d3.scaleLinear()
      .range([that.configBackToBack.boundedWidth / 4, 0])


    // Y axis
    that.y = d3.scaleBand()
      .range([0, that.configBackToBack.boundedHeight])
      .padding(.2);

    // color
    that.colorScale = d3.scaleOrdinal()
      .range(that.configBackToBack.colorScale)
      .domain(that.configData.bandArray);

    // Reference to the tooltip
    that.tooltip = d3.select('#tooltipB2B');
    that.tooltipText = d3.select('#informationB2B');
  }

  update() {
    const that = this;

    that.y.domain(that.configData.bandArray)
    that.vizLeft.append("g")
      .attr("class", "labels")
      .attr("transform", "translate(" + (that.configBackToBack.boundedWidth / 4) + ", 0)")
      .call(d3.axisRight(that.y).tickSize(0))
      .selectAll("text")
      .attr("transform", "translate(120,0)")
      .style("text-anchor", "middle")
      .style("font-size", 18)

    that.xLeft.domain([0, 100]).nice()
    that.vizLeft.append("g")
      .attr("class", "leftXaxis")
      .attr("transform", "translate(0 ," + that.configBackToBack.boundedHeight + ")")
      .call(d3.axisBottom(that.xLeft).ticks(5).tickSizeInner(-that.configBackToBack.boundedHeight).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "translate(-8,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 12)

    // append labels
    that.svg.append("text")
      .attr("class", "label-left")
      .attr("x", document.querySelector(".leftXaxis").getBoundingClientRect().width / 2)
      .attr("y", document.querySelector(".vizLeft").getBoundingClientRect().height + 36)
      .attr("fill", that.configBackToBack.colors.fg)
      .style("text-anchor", "middle")
      .style("font-size", 18)
      .text("WBL Index");

    // mirror
    that.widthRight = that.configBackToBack.boundedWidth - document.querySelector(".vizLeft").getBoundingClientRect().width
    that.xRight = d3.scaleLinear()
      .range([0, that.widthRight])
      .domain([0, 120]).nice();

    that.axisRight = d3.axisBottom(that.xRight).ticks(6).tickSizeInner(-that.configBackToBack.boundedHeight).tickSizeOuter(0)

    that.vizRight.attr(
      "transform",
      `translate(
                  ${document.querySelector(".vizLeft").getBoundingClientRect().width + 10}, 
                  ${that.configBackToBack.margin.top}
                  )`
    );
    that.vizRight.append("g")
      .attr("class", "rightXaxis")
      .attr("transform", "translate(0 ," + that.configBackToBack.boundedHeight + ")")
      .call(that.axisRight)
      .selectAll("text")
      .attr("transform", "translate(8,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 12)

    that.svg.append("text")
      .attr("class", "label-right")
      .attr("x", document.querySelector(".rightXaxis").getBoundingClientRect().left - 110)
      .attr("y", document.querySelector(".vizLeft").getBoundingClientRect().height + 36)
      .attr("fill", that.configBackToBack.colors.fg)
      .style("text-anchor", "middle")
      .style("font-size", 18)
      .text("Number of years to reach equality");

    this.render()
  }

  render() {
    const that = this;

    const barsLeft = that.vizLeft.selectAll("rect")
      .data(that.data.data.maxYear)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => that.xLeft(0))
      .attr("y", function (d) {
        return that.y(d.key)
      })
      .attr("width", 0)
      .attr("height", that.y.bandwidth())
      .attr('fill', d => that.colorScale(d.key))

    barsLeft.transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("width", function (d) {
        return (that.configBackToBack.boundedWidth / 4) - that.xLeft(d.val)
      })
      .attr("x", d => that.xLeft(d.val))

    that.y.padding(.4)

    const barsRight = that.vizRight.selectAll("rect")
      .data(Array.from(that.data.remainingTime, function (item) {
        return {
          key: item[0],
          value: item[1]
        }
      }))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", that.xRight(0))
      .attr("y", d => that.y(d.key))
      .attr("width", d => that.xRight(0))
      .attr("height", that.y.bandwidth())
      .attr('fill', d => that.colorScale(d.key))

    barsRight.transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("width", d => that.xRight(d.value))

    that.vizRight.selectAll(".tick line")
      .attr("stroke", that.configBackToBack.colors.seconday)
      .attr("stroke-dasharray", "2,2")
    that.vizLeft.selectAll(".tick line")
      .attr("stroke", that.configBackToBack.colors.seconday)
      .attr("stroke-dasharray", "2,2")

    this.createTooltips(barsLeft, that)
    this.createTooltips(barsRight, that)

    barsLeft.on('click', function(event) {
      const isActive = d3.select(this).classed('active')
      const filling = this.attributes.fill
      let matchingBar;
      d3.select(this).classed('active', !isActive)
      for (const bar of barsRight) {
        if (bar.attributes.fill.value === filling.value) matchingBar = bar
      }
      //d3.select(matchingBar).classed('active', !isActive)
      d3.select(matchingBar).attr('class', this.classList.value)

      const selectedRegions = that.vizLeft.selectAll('.bar.active').data().map(e => e.key)
      that.dispatcher.call('filterRegion', event, selectedRegions)
    })

    barsRight.on('click', function(event) {
      const isActive = d3.select(this).classed('active')
      const filling = this.attributes.fill
      let matchingBar;
      d3.select(this).classed('active', !isActive)
      for (const bar of barsLeft) {
        if (bar.attributes.fill.value === filling.value) matchingBar = bar
      }
      //d3.select(matchingBar).classed('active', !isActive)
      d3.select(matchingBar).attr('class', this.classList.value)

      const selectedRegions = that.vizRight.selectAll('.bar.active').data().map(e => e.key)
      that.dispatcher.call('filterRegion', event, selectedRegions)
    })
  }

  createTooltips(bars, that) {
    bars.on('mouseover', function (event, d) {
      that.tooltipText.html(function () {
        if (bars._parents[0].className.baseVal === "vizRight") {
          return `
          <span><b>${d.key}</b></span>
            <table>
              <tr>
                <td><b>Time before equity: </b></td>
                <td>${d.value} years</td>
              </tr>
            </table>
          `
        } else {
          return `
          <span><b>${d.key}</b></span>
            <table>
              <tr>
                <td><b>WBL Score: </b></td>
                <td>${(d.val).toFixed(1)} %</td>
              </tr>
            </table>
          `
        }
      })
    }).on('mousemove', function (event, d) {
      // Move the tooltip itself
      let width = that.tooltip.node().getBoundingClientRect().width;
      let height = that.tooltip.node().getBoundingClientRect().height;
      that.tooltip
        .style('left', event.clientX - (width / 2) - 5 + 'px')
        .style('top', event.clientY - (height) - 15 + 'px')
        .style('opacity', 1);
    }).on('mouseout', function () {
      that.tooltip.style('opacity', 0);
    });
  }
}

export default BacktoBack