import './styles/style.css';
import * as d3 from 'd3';
import {
    GLOBAL
} from './src/global.js';
import Map from './visualizations/Map'
import Barchart from './visualizations/Barchart';
import {
    transformData,
    AddScrollScore,
    GetEvolutionSpeed,
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

    GLOBAL.dataSets = {
        'wbl': wblData,
        'map': worldData,
        'demo': demographicsData,
    }

    mergedData = transformData(wblData, worldData, demographicsData, GLOBAL.currentYear);
    GLOBAL.yearMap = GetEvolutionSpeed(wblData)

    // console.log(worldData)
    // console.log(demographicsData)
    // console.log(mergedData)

    // click on go back
    // on click go back
    document.querySelector('#return-map').addEventListener('click', event => {

        const input = d3.select('#yearSlider')
        const span = d3.select('#rangeValue')

        input.node().value = GLOBAL.currentYear;
        span.html(GLOBAL.currentYear);

        // redraw map
        
        drawMap(GLOBAL.dataSets);

        document.querySelector('#map-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        });
    })

    // scrolling event
    const barChartSlider = document.querySelector('#timeWheel');
    let years = GLOBAL.yearMap.years.array;
    let maxIndex = years.indexOf(GLOBAL.yearMap.years.max)
    let barChartSliderScore;

    barChartSliderScore = AddScrollScore('#timeWheel', barChartSliderScore, maxIndex)
    barChartSlider.addEventListener('wheel', modifyYearOnScroll);

    barChartSliderScore.score = years.indexOf(GLOBAL.currentYear)

    function modifyYearOnScroll(event) {
        const selected = d3.select('#selected')
        
        selected.html(years[barChartSliderScore.score])
        GLOBAL.currentYear = years[barChartSliderScore.score]

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

        // redraw chart
        GLOBAL.currentCountry.data = transformData(GLOBAL.dataSets.wbl, GLOBAL.dataSets.map, GLOBAL.dataSets.demo, GLOBAL.currentYear, GLOBAL.currentCountry.name);
        GLOBAL.currentCountry.drawBarchart(document.querySelector('#vizBarchart'))
    }

    drawMap(GLOBAL.dataSets);
    drawBarchart(mergedData);
};

function drawBarchart(mergedData) {
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

    // *********** TO FIX
    //getMeanIndicatorsGlobal(GLOBAL.dataSets.wbl, GLOBAL.currentYear)


    //barchartHorizontal = new Barchart(configBarchart.region, configData, mergedData)
    //barchartHorizontal.update()

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

    //configData.dataAccessors.color = null;
    map = new Map(configMap, configData, dataSets, GLOBAL.currentYear)
    map.updateMap();
}

drawViz();
