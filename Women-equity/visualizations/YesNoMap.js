import * as d3 from 'd3';
import { transformData } from '../src/util.js';
import { GLOBAL } from '../src/global.js';
import Map from './Map';

class YesNoMap extends Map {
    constructor(configMap, configData, dataSets, year) {
        super(configMap, configData, dataSets, year);
    }
    
    // Function to draw the map based on data and selection
    drawMap(data, sel) {
        const that = this;
        const countries = sel
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('d', that.path)
            .attr('class', 'country')
            .style('stroke', that.configMap.colors.bg);

        // Check if colorScale is not defined
        if (!that.configMap.colorScale) {
            countries
                .style('fill', 'none') // Set fill to none
                .style('opacity', '0.1'); // Set opacity to 0.1
        } else {
            countries.style('fill', (d) => {
                if (that.configData.dataAccessors.color === null) {
                    return that.configMap.colors.bg; // Set fill to background color if color parameter is null
                } else {
                    if (d[that.configData.dataAccessors.paramToCheck] !== undefined) {
                        const answer = d.questions?.pay['Can a woman work in an industrial job in the same way as a man?'];
                        return answer === 'Yes' ? that.configMap.colorScale[0] : that.configMap.colorScale[1];
                    } else {
                        return that.configMap.colors.bg; 
                    }
                }
            });
        }

        // Reference to the tooltip
        that.tooltip = d3.select('#tooltipYesNoMap');
        that.tooltipText = d3.select('#informationYesNoMap');
        this.createTooltips(countries, that); // Create tooltips for countries
        this.drawLegend(); // Draw the legend
    }

    // Function to create tooltips for countries on mouse events
    createTooltips(countries, that) {
        countries.on('mouseover', function (event, d) {
            that.tooltipText.html(function () {
                if (d.scoring != undefined) {
                    return `
                    <table>
                      <tr>
                        <td>${d.scoring.economy}</td>
                      </tr>
                    </table>
                  `;
                }
            });
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

    // Function to draw the legend
    drawLegend() {
        const that = this;

        const legendWidth = 200;
        const legendHeight = 20;

        // Create an SVG element for the legend
        const legend = d3
            .select('#yesNoMapLegend')
            .append('svg')
            .attr('class', 'legend')
            .attr('width', legendWidth)
            .attr('height', legendHeight);

        const colors = [that.configMap.colorScale[0], that.configMap.colorScale[1]]; // Get the colors from the color scale

        // Create legend items for each color
        const legendItems = legend
            .selectAll('.legend-item')
            .data(colors)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 100}, 0)`);

        // Add rectangles representing the colors
        legendItems
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', (d) => d);

        // Add text labels for the legend items
        legendItems
            .append('text')
            .attr('x', 30)
            .attr('y', 15)
            .text((d, i) => (i === 0 ? 'Yes' : 'No'))
            .style('font-size', '12px')
            .style('fill', 'white');
    }
}

export default YesNoMap;
