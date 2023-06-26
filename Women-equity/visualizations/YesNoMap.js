import * as d3 from 'd3';
import { transformData } from '../src/util.js';
import { GLOBAL } from '../src/global.js';
import Map from './Map';

class YesNoMap extends Map {
    constructor(configMap, configData, dataSets, year) {
        super(configMap, configData, dataSets, year);
    }

    drawMap(data, sel) {
        const that = this;
        const countries = sel
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('d', that.path)
            .attr('class', 'country')
            .style('stroke', that.configMap.colors.fg);

        if (!that.configMap.colorScale) {
            countries
                .style('fill', 'none')
                .style('opacity', '0.1');
        } else {
            countries.style('fill', (d) => {
                if (that.configData.dataAccessors.color === null) {
                    return that.configMap.colors.bg;
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
        const tooltip = d3.select('#tooltip');
        const tooltipText = d3.select('#information');

        countries.on('mousemove', function (event, d) {
            // Move the tooltip itself
            tooltip.style('opacity', 1)
                .style('left', event.pageX - 86 + 'px')
                .style('top', event.pageY - 60 + 'px');

            tooltipText.html(function () {
                return `
            <table>
              <tr>
                <td><b>Country:</b></td>
                <td>${d.Economy}</td>
              </tr>
            </table>
          `
            });
        }).on('mouseout', function () {
            tooltip.style('opacity', 0);
        });



        this.drawLegend();
    }

    drawLegend() {
        const that = this;

        const legendWidth = 200;
        const legendHeight = 20;

        const legend = d3
            .select('#yesNoMapLegend')
            .append('svg')
            .attr('class', 'legend')
            .attr('width', legendWidth)
            .attr('height', legendHeight);

        const colors = [that.configMap.colorScale[0], that.configMap.colorScale[1]];

        const legendItems = legend
            .selectAll('.legend-item')
            .data(colors)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 100}, 0)`);

        legendItems
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', (d) => d);

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
