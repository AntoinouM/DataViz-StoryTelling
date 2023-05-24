import * as d3 from 'd3';

class Map {
    constructor(data, configMap, configData) {
        this.data = data;

        // configurate objects with default
        this.configMap = {
            parentElement: configMap.parentElement || 'body',
            width: configMap.width || window.innerWidth * 0.75,
            height: configMap.height || window.innerHeight * 0.65,
            margin: configMap.margin || {top: 20,right: 20,bottom: 35,left: 35},
            colors: configMap.colors || {'fg' : '#f8f8f2', 'bg': '#282a36'},
            //colorScale: configMap.colorScale || [ '#bca0dc', '#b491c8', '#7c5295', '#663a82', '#52307c', '#3c1361'],
            colorScale: configMap.colorScale || [ '#bca0dc', '#663a82', '#3c1361'],
        }

        this.configData = {
            minYear: configData.minYear || 1971,
            maxYear: configData.maxYear || 2023,
            currentYear: configData.currentYear || 2000,
            minWBLIndex: configData.minIndex || 0,
            maxWBLIndex: configData.maxIndex || 100,
            dataAccessors: configData.dataAccessors || {color: 'scoring.wbl_index'},
        }

        this.initViz();
    }

    initViz() {

        const that = this;

        /* **** SETUP ****/

        // inner bounds
        that.boundedWidth = that.configMap.width - that.configMap.margin.left - that.configMap.margin.right;
        that.boundedHeight = that.configMap.height - that.configMap.margin.top - that.configMap.margin.bottom;
        // generators
        that.projection = d3
            .geoMercator()
            .translate([that.configMap.width / 2.2, that.configMap.height / 1.4])
            .scale([150]);
        that.path = d3.geoPath().projection(that.projection);
        // scales
        that.colorScale = d3
            .scaleSequential()
            .interpolator(d3.interpolateBuPu);
        // svg
        that.svg = d3.select(that.configMap.parentElement)
            .append('svg')
                .attr('width', that.configMap.width)
                .attr('height', that.configMap.height)
        // drawing area
        that.viz = that.svg
            .append('g')
                .attr('class', 'mapViz')
                .attr('transform', `translate(${that.configMap.margin.left}, 0)`);
    }

    updateMap() {
        const that = this;

        that.colorAccessor = d => d[that.configData.dataAccessors.color];

        // domain
        that.colorScale.domain([that.configData.minWBLIndex, that.configData.maxWBLIndex])

        // draw map initially
        this.drawMap(that.data, that.viz)
    }

    drawMap(data, sel) {
        const that = this;

        const countries = sel
            .selectAll('path')
            .data(data)
            .join('path')
                .attr('d', that.path)
                .attr('class', 'country')
                .style('stroke', that.configMap.colors.fg)
                .style('fill', (d) => {
                    if (that.configData.dataAccessors.color === null) {
                        return that.configMap.colors.bg
                    } else {
                        //if (d.scoring === undefined) console.log(d)
                        if (d.scoring !== undefined) {
                            return that.colorScale(d.scoring.wbl_index)
                        } else {
                            return that.configMap.colors.fg
                        }
                    }
                })
    }

}

export default Map;