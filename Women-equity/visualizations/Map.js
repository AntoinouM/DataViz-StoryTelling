import * as d3 from 'd3';
import {
    transformData
} from '../src/util.js';
import {
    GLOBAL
} from '../src/global.js';

class Map {
    constructor(configMap, configData, dataSets, year) {
        this.dataSets = dataSets;
        this.currentYear = year;

        // configurate objects with default
        this.configMap = {
            parentElement: configMap.parentElement || 'body',
            linkedElement: configMap.linkedElement || '#bar-chart',
            width: configMap.width || window.innerWidth * 0.8,
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
            colorScale: configMap.colorScale || false,
            clickable: configMap.clickable || false
        }

        this.configData = {
            minYear: configData.minYear || 1971,
            maxYear: configData.maxYear || 2023,
            currentYear: configData.currentYear || 2000,
            minWBLIndex: configData.minIndex || 0,
            maxWBLIndex: configData.maxIndex || 100,
            dataAccessors: configData.dataAccessors || {
                paramToCheck: 'scoring',
                color: 'scoring.wbl_index'
            },
            sliderGetter: configData.sliderGetter || null,
            domain: configData.domain || null,
        }

        this.initViz();
    }

    initViz() {
        const that = this;

        that.data;

        // check if a slider is attached to the configuration
        if (that.configData.sliderGetter !== null) {
            that.slider = {
                'input': d3.select(that.configData.sliderGetter.input),
                'span': d3.select(that.configData.sliderGetter.span),
                'btn': d3.select(that.configData.sliderGetter.btn),
            }
            that.slider.span.html(that.currentYear)
        }

        // transform the data and attach it to the instance
        that.data = transformData(that.dataSets, that.currentYear);

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

        // define what data is responsible for the color change
        that.colorAccessor = d => d[that.configData.dataAccessors.paramToCheck][that.configData.dataAccessors.color]

        // domain
        if(that.configData.domain) that.colorScale.domain(that.configData.domain)
            

        // slider update
        if (that.configData.sliderGetter !== null) {
            this.updateDOMandDataOnSliderChange(that)
            // add play btn interaction
            this.addPlayBtnInteraction(that)
        }
        // draw map initially
        this.drawMap(that.data, that.viz)
        if (that.configMap.clickable) {
            // define zoom and pan
            that.zoom = d3.zoom()
                .scaleExtent([1, 10]) // scale factor
                .translateExtent([
                    [-300, -300], // x0 and y0
                    [1500, 1000] // x1 and y1
                ])
                .on('zoom', function (event) {
                    that.viz.attr('transform', event.transform)
                    that.zoomLevel = event.transform.k
                });

            // Call the zoom on the next parent element of your 'to be zoomed' selection
            that.svg.call(that.zoom);
        }


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
        if (!that.configMap.colorScale) {
            countries.style('fill', 'none')
                    .style('opacity', '0.1')
        }
        else {
            countries.style('fill', (d) => {

                if (that.configData.dataAccessors.color === null) {
                    return that.configMap.colors.bg
                } else {
                    //if (d.scoring === undefined) console.log(d)
                    if (d[that.configData.dataAccessors.paramToCheck] !== undefined) {
                        // console.log(d.questions.pay['Can a woman work in an industrial job in the same way as a man?'])
                        return that.colorScale(that.colorAccessor(d))
                    } else {
                        return that.configMap.colors.bg
                    }
                }
            })
        }
        if (that.configMap.clickable) {
            this.drawBarchartOnClick(countries)
        }

    }


    drawBarchartOnClick(countries) {
        const that = this;
        countries.on('click', function (event, d) {

            // onclick reset zoom of map
            that.resetZoom(1.16, that)
            that.updateCountryObject(d, that)

            // update barCharttitle
            d3.select('#titleBarchart').text(GLOBAL.currentCountry.name)
            // show slider and update value
            d3.select('#timeWheel').style('opacity', 1)
            GLOBAL.updateSliderElement(d3)

            // draw barchart
            GLOBAL.currentCountry.drawBarchart(document.querySelector('#vizBarchart'));

            // check for indicator
            if (GLOBAL.currentIndicator.name) {
                //update questions
            }

            // scroll to barchart
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
    updateCountryObject(d, that) {
        GLOBAL.currentCountry.code = d.country_code;
        GLOBAL.currentCountry.name = d.properties.geounit;
        // update data
        GLOBAL.currentCountry.data = transformData(that.dataSets, that.currentYear, GLOBAL.currentCountry.name);
    }
    resetZoom(num, that) {
        // reset zoom
        if (num) {
            if (that.zoomLevel >= num) {
                that.svg.transition()
                    .duration(250)
                    .call(that.zoom.transform, d3.zoomIdentity
                        .translate(25, 0))
            }
        } else {
            that.svg.transition()
                .duration(250)
                .call(that.zoom.transform, d3.zoomIdentity
                    .translate(25, 0))
        }

    }
    updateDOMandDataOnSliderChange(that) {
        that.slider.input.on('input', function () {
            that.currentYear = +this.value
            GLOBAL.currentYear = +this.value
            that.slider.span.html(+this.value)

            that.data = transformData(that.dataSets, that.currentYear);
            that.drawMap(that.data, that.viz)
        })
    }
    addPlayBtnInteraction(that) {
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
                    that.data = transformData(that.dataSets, that.currentYear);
                    that.drawMap(that.data, that.viz)
                }, 70);
            } else {
                that.slider.btn.html('▶');
                clearInterval(play_interval);
                play_interval = null;
            }
        });
    }
}

export default Map;