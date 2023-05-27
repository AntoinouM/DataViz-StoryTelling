import * as d3 from 'd3';
import {
    transformData
} from '../src/util.js';
import {
    GLOBAL
} from '../src/global.js';

class Map {
    constructor(configMap, configData, dataSets, currentYear) {
        this.dataSets = dataSets;
        this.currentYear = currentYear;

        // configurate objects with default
        this.configMap = {
            parentElement: configMap.parentElement || 'body',
            linkedElement: configMap.linkedElement || '#bar-chart',
            width: configMap.width || window.innerWidth * 0.75,
            height: configMap.height || window.innerHeight * 0.65,
            margin: configMap.margin || {
                top: 20,
                right: 20,
                bottom: 35,
                left: 35
            },
            colors: configMap.colors || {
                'fg': '#f8f8f2',
                'bg': '#282a36'
            },
            //colorScale: configMap.colorScale || [ '#bca0dc', '#b491c8', '#7c5295', '#663a82', '#52307c', '#3c1361'],
            colorScale: configMap.colorScale || ['#bca0dc', '#663a82', '#3c1361'],
        }

        this.configData = {
            minYear: configData.minYear || 1971,
            maxYear: configData.maxYear || 2023,
            currentYear: configData.currentYear || 2000,
            minWBLIndex: configData.minIndex || 0,
            maxWBLIndex: configData.maxIndex || 100,
            dataAccessors: configData.dataAccessors || {
                color: 'scoring.wbl_index'
            },
            sliderGetter: configData.sliderGetter || null
        }

        this.initViz();
    }

    initViz() {
        const that = this;

        that.data;

        if (that.configData.sliderGetter !== null) {
            that.slider = {
                'input': d3.select(that.configData.sliderGetter.input),
                'span': d3.select(that.configData.sliderGetter.span),
                'btn': d3.select(that.configData.sliderGetter.btn),
            }
            that.slider.span.html(that.currentYear)
        }

        that.data = transformData(that.dataSets.wbl, that.dataSets.map, that.dataSets.demo, that.currentYear);

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
        if (document.querySelector(that.configMap.parentElement).firstElementChild) {
            document.querySelector(that.configMap.parentElement).innerHTML = '';
        }
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

        // slider update
        if (that.configData.sliderGetter !== null) {
            that.slider.input.on('input', function () {
                that.currentYear = +this.value
                GLOBAL.currentYear = +this.value
                that.slider.span.html(+this.value)

                that.data = transformData(that.dataSets.wbl, that.dataSets.map, that.dataSets.demo, that.currentYear);
                that.drawMap(that.data, that.viz)
            })
        }

        // play btn
        let play_interval = null;

        that.slider.btn.on('click', function () {
            if (play_interval === null) {
                that.slider.btn.html('||')

                // start the interval
                play_interval = setInterval(function () {
                    if (that.currentYear < that.configData.maxYear) {
                        that.currentYear += 1;
                    } else {
                        that.currentYear -= that.configData.maxYear - that.configData.minYear
                    }

                    that.slider.input.node().value = that.currentYear;
                    GLOBAL.currentYear = that.currentYear
                    that.slider.span.html(that.currentYear);
                    that.data = transformData(that.dataSets.wbl, that.dataSets.map, that.dataSets.demo, that.currentYear);
                    that.drawMap(that.data, that.viz)
                }, 70);
            } else {
                that.slider.btn.html('▶');
                clearInterval(play_interval);
                play_interval = null;
            }
        });

        // draw map initially
        this.drawMap(that.data, that.viz)

        that.zoom = d3.zoom()
            .scaleExtent([1, 10]) // scale factor
            .translateExtent([
                [-300, -300], // x0 and y0
                [1500, 1000] // x1 and y1
            ])
            .on('zoom', function (event) {
                that.viz.attr('transform', event.transform)
            });

        // Call the zoom on the next parent element of your 'to be zoomed' selection
        that.svg.call(that.zoom);
    }

    drawMap(data, sel) {
        const that = this;

        const countries = sel
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('d', that.path)
            .attr('class', 'country')
            .style('fill', that.configMap.colors.bg)
            .style('stroke', that.configMap.colors.fg)
            .style('fill', (d) => {
                if (that.configData.dataAccessors.color === null) {
                    return that.configMap.colors.bg
                } else {
                    //if (d.scoring === undefined) console.log(d)
                    if (d.scoring !== undefined) {
                        return that.colorScale(d.scoring.wbl_index)
                    } else {
                        return that.configMap.colors.bg
                    }
                }
            })
        this.updateCountry(countries)
    }


    updateCountry(countries) {
        const that = this;
        countries.on('click', function (event, d) {
            // reset zoom
            that.svg.transition()
                .duration(350)
                .call(that.zoom.transform, d3.zoomIdentity);

            GLOBAL.currentCountry.code = d.country_code;
            GLOBAL.currentCountry.name = d.properties.geounit;

            // update data
            GLOBAL.currentCountry.data = transformData(that.dataSets.wbl, that.dataSets.map, that.dataSets.demo, that.currentYear, GLOBAL.currentCountry.name);

            d3.select('#titleBarchart').text(GLOBAL.currentCountry.name)

            // show slider
            d3.select('#timeWheel').style('opacity', 1)
            d3.select('#selected').html(GLOBAL.currentYear)

            if (GLOBAL.currentYear === GLOBAL.yearMap.years.min) {
                d3.select('#prev').text('')
            } else {
                d3.select('#prev').text(GLOBAL.currentYear - 1)
            }

            if (GLOBAL.currentYear === GLOBAL.yearMap.years.max) {
                d3.select('#next').text('')
            } else {
                d3.select('#next').text(GLOBAL.currentYear + 1)
            }

            GLOBAL.currentCountry.drawBarchart(document.querySelector('#vizBarchart'));

            const barchartSection = document.querySelector(that.configMap.linkedElement)
            setTimeout(function () {
                barchartSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start'
                });
            }, 150)

        })
    }
}

export default Map;