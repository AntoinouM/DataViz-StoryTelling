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
  }
  
}

export default YesNoMap;
