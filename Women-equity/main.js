import './styles/style.css';
import * as d3 from 'd3';
import { GLOBAL } from './src/global.js';
import Map from './visualizations/Map'
import Barchart from './visualizations/Barchart';
import {
    transformData,
    AddScrollScore,
    GetEvolutionSpeed
} from './src/util.js';
import {
    configMap,
    configBarchart,
    colors
} from './src/config.js'
import { forEach } from 'lodash';

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

    const dataSets = {
        'wbl': wblData,
        'map': worldData,
        'demo': demographicsData,
    }

    mergedData = transformData(wblData, worldData, demographicsData, GLOBAL.currentYear);
    GLOBAL.yearMap = GetEvolutionSpeed(wblData)

    // console.log(worldData)
    // console.log(demographicsData)
    // console.log(mergedData)

    drawMap(dataSets);
    drawBarchart(dataSets);
};

function drawBarchart(dataSets) {
    // init data object
    const configData = {
        xAxisTicks: '%',
        yAxisTicks: 'Region',
        maxValue: 100,
        bandArray: [],
        dataAccessors: {
            color: 'key',
            x: 'key',
            y: 'val',
        }
    }

    /* [2] ===== CHART DIMENSION ===== */
    configBarchart.boundedWidth = configMap.width - configMap.margin.left - configMap.margin.right;
    configBarchart.boundedHeight = configMap.height - configMap.margin.top - configMap.margin.bottom;

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


    barchartHorizontal = new Barchart(configBarchart, configData, dataSets)
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
        dataAccessors: {color: 'scoring.wbl_index'},
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
