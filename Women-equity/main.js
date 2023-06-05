import './styles/style.css';
import * as d3 from 'd3';
import {
    GLOBAL
} from './src/global.js';
import Map from './visualizations/Map'
import Barchart from './visualizations/Barchart';
import BacktoBack from './visualizations/BacktoBack';
import {
    transformData,
    AddScrollScore,
    generateYearMap,
    getMeanIndicatorsGlobal
} from './src/util.js';
import {
    configMap,
    configBarchart,
    colors
} from './src/config.js'
import {
    forEach
} from 'lodash';

// WHY DO I NEED TO GO TO TOP OF PAGE???
document.querySelector('#map-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start'
});

/**
 * Setting up const & variables
 */
GLOBAL.currentYear = 2000;
let mergedData;

let map;
let barchartHorizontal;


async function drawViz() {

    /* [1] ===== ACCESS DATA ===== */
    // Load world data
    const worldData = await d3.json('./data/world.geo.json');
    const demographicsData = await d3.csv('./data/SP.POP.TOTL.FE.csv')
    const wblData = await d3.dsv(";", "./data/WBL-panel.csv")
    const gdpData = await d3.csv('./data/API_NY.GDP.MKTP.CD_DS2_en_csv_v2_5454986.csv')

    GLOBAL.dataSets = {
        'wbl': wblData,
        'map': worldData,
        'demo': demographicsData,
        'gdp': gdpData,
    }

    mergedData = transformData(GLOBAL.dataSets, GLOBAL.currentYear);
    GLOBAL.yearMap = generateYearMap(wblData)

    // console.log(worldData)
    // console.log(demographicsData)
    // console.log(mergedData)

    // on click go back
    onCLickUpdateAndScroll('#return-map', '#map-section')
    onCLickUpdateAndScroll('#return-map2', '#map-section')
    onCLickUpdateAndScroll('#goNext', '#backtoback')
    // Manage scrolling event for barchart year
    addScrollingEventYear()
    // Bar chart scroll to next
    let scrollingBarChart;
    scrollingBarChart = AddScrollScore('#bar-chart', scrollingBarChart, null)

    //scrollTo(scrollingBarChart, document.querySelector('#backtoback'))


    drawMap(GLOBAL.dataSets);
    drawBackToBack();
};



function onCLickUpdateAndScroll(elemNameSrc, elemNameTrgt) {
    document.querySelector(elemNameSrc).addEventListener('click', event => {

        if (elemNameTrgt === '#map-section') {
            const input = d3.select('#yearSlider')
            const span = d3.select('#rangeValue')

            input.node().value = GLOBAL.currentYear;
            span.html(GLOBAL.currentYear);

            // redraw map
            drawMap(GLOBAL.dataSets);
        }

        d3.select('#questions').style('display', 'none')

        document.querySelector(elemNameTrgt).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
    })
}

function scrollTo(objScore, DOMelemTarget) {

    objScore.parent.addEventListener('wheel', function () {
        if (objScore.score >= 30 || !objScore.lastDirUp) {
            setTimeout(function () {
                DOMelemTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start'
                });
            }, 150)
        }
    })
}

function drawBarchart() {
    // init data object
    const configData = {
        xAxisTicks: 'Region',
        yAxisTicks: '%',
        maxValue: 100,
        bandArray: [],
        dataAccessors: {
            color: 'key',
            x: 'key',
            y: 'val',
        }
    }

    GLOBAL.yearMap.data.maxYear.forEach(element => {
        configData.bandArray.push(element.key)
    })
    configData.bandArray.sort();

    // reorder datasets from yearMap
    GLOBAL.yearMap.data.maxYear = GLOBAL.yearMap.data.maxYear.sort((a, b) => {
        return configData.bandArray.indexOf(a.key) - configData.bandArray.indexOf(b.key)
    })
    GLOBAL.yearMap.data.minYear = GLOBAL.yearMap.data.minYear.sort((a, b) => {
        return configData.bandArray.indexOf(a.key) - configData.bandArray.indexOf(b.key)
    })

    // *** TO FIX
    //getMeanIndicatorsGlobal(GLOBAL.dataSets.wbl, GLOBAL.currentYear)

    barchartHorizontal = new Barchart(configBarchart.region, configData, GLOBAL.yearMap.data.maxYear)
    barchartHorizontal.update()

}

function drawBackToBack() {
    // init data object
    const configData = {
        bandArray: [],
        leftPart: {
            yAxisTicks: 'Region',
            yAxisTicks: '%',
            maxValue: 100,
            dataAccessors: {
                color: 'key',
                x: 'val',
                y: 'key',
            }
        },
        rightPart: {
            yAxisTicks: 'Region',
            yAxisTicks: 'Remaining years',
            maxValue: 100,
            dataAccessors: {
                color: 'remainingTime.key',
                x: 'remainingTime.val',
                y: 'remainingTime.key',
            }
        }
    }

    GLOBAL.yearMap.data.maxYear.forEach(element => {
        configData.bandArray.push(element.key)
    })
    configData.bandArray.sort();

    // reorder datasets from yearMap
    GLOBAL.yearMap.data.maxYear = GLOBAL.yearMap.data.maxYear.sort((a, b) => {
        return configData.bandArray.indexOf(a.key) - configData.bandArray.indexOf(b.key)
    })
    GLOBAL.yearMap.data.minYear = GLOBAL.yearMap.data.minYear.sort((a, b) => {
        return configData.bandArray.indexOf(a.key) - configData.bandArray.indexOf(b.key)
    })

    // *********** TO FIX
    //getMeanIndicatorsGlobal(GLOBAL.dataSets.wbl, GLOBAL.currentYear)

    barchartHorizontal = new BacktoBack(configBarchart.region, configData, GLOBAL.yearMap.data.maxYear)
    barchartHorizontal.update()
}

function drawMap(dataSets) {
    // init my data object
    const configData = {
        minYear: +GLOBAL.yearMap.years.min,
        maxYear: +GLOBAL.yearMap.years.max,
        currentYear: GLOBAL.currentYear,
        minIndex: Math.floor(d3.min(dataSets.wbl, (d) => +d.WBL_INDEX.replace(",", "."))),
        maxIndex: Math.ceil(d3.max(dataSets.wbl, (d) => +d.WBL_INDEX.replace(",", "."))),
        dataAccessors: {
            color: 'scoring.wbl_index'
        },
        sliderGetter: {
            'input': '#yearSlider',
            'span': '#rangeValue',
            'btn': '#playBtn',
        }
    }

    /* [2] ===== CHART DIMENSION ===== */
    configMap.boundedWidth = configMap.width - configMap.margin.left - configMap.margin.right;
    configMap.boundedHeight = configMap.height - configMap.margin.top - configMap.margin.bottom;

    // // Set the dimensions of the map container
    // configMap.width = 800; // Specify the desired width
    // configMap.height = 500; // Specify the desired height

    // Create the map object
    map = new Map(configMap, configData, dataSets, GLOBAL.currentYear);

    // Draw the map
    map.updateMap();
}

function addScrollingEventYear() {
    // scrolling event
    const barChartSlider = document.querySelector('#timeWheel');
    let years = GLOBAL.yearMap.years.array;
    let maxIndex = years.indexOf(GLOBAL.yearMap.years.max)
    let barChartSliderScore;

    barChartSliderScore = AddScrollScore('#timeWheel', barChartSliderScore, maxIndex)
    barChartSlider.addEventListener('wheel', modifyYearOnScroll);
    barChartSliderScore.score = years.indexOf(GLOBAL.currentYear)

    // set Mutable Observer
    observeYear(document.getElementById('selected'), { attributes: true, childList: true, subtree: true })

    function modifyYearOnScroll(event) {
        const selected = d3.select('#selected')

        selected.html(GLOBAL.yearMap.years.array[barChartSliderScore.score])
        GLOBAL.currentYear = GLOBAL.yearMap.years.array[barChartSliderScore.score]

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
    }
}

function observeYear(DOMelem, config) {

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        // redraw chart
        GLOBAL.currentCountry.dataUpdate()
        GLOBAL.currentCountry.drawBarchart(document.querySelector('#vizBarchart'))

        // update questions
        if (GLOBAL.currentIndicator.questions) {
            GLOBAL.currentIndicator.updateHtmlQuestions(document.querySelector('#questions'))
        }

    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(DOMelem, config);
}

drawViz()