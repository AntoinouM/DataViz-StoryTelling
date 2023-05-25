import './styles/style.css';
import * as d3 from 'd3';
import { GLOBAL } from './src/global.js';
import Map from './visualizations/Map'

// import helping function from utilsnp
import {
    transformData,
    AddScrollScore,
    GetEvolutionSpeed
} from './src/util.js';
import { merge } from 'lodash';

import {
    configMap,
    configBarchart,
    colors
} from './src/config.js'

/**
 * Setting up const & variables
 */
GLOBAL.currentYear = 2000;
let mergedData;

let map;


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

    drawMap(dataSets, GLOBAL.yearMap);


};

function drawBarchart(dataSets) {
    // init data object
    const configData = {
        orientationHorizontal: false,

    }

    /* [2] ===== CHART DIMENSION ===== */
    configBarchart.boundedWidth = configMap.width - configMap.margin.left - configMap.margin.right;
    configBarchart.boundedHeight = configMap.height - configMap.margin.top - configMap.margin.bottom;
}

function drawMap(dataSets, yearMap) {
    // init my data object
    const configData = {
        minYear: +GLOBAL.yearMap.entries().next().value[0],
        maxYear: +GLOBAL.yearMap.entries().next().value[1],
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
