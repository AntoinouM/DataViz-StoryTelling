import './styles/style.css';
import * as d3 from 'd3';
import { QuestionMap } from './src/global.js';
import Map from './visualizations/Map'

// import helping function from utilsnp
import {
    transformData,
    AddScrollScore,
    GetEvolutionSpeed
} from './src/util.js';
import { merge } from 'lodash';

/**
 * Setting up const & variables
 */
let currentYear = 2023;
let mergedData;
let yearMap;

let map;

const colors = {
    'bg': '#282a36',
    'bg-sec': '#44475a',
    'fg': '#f8f8f2',
    'seconday': '#6272a4',
    'cyan': '#8be9fd',
    'green': '#50fa7b',
    'orange': '#ffb86c',
    'pink': '#ff79c6',
    'purple': '#bd93f9',
    'red': '#ff5555',
    'yellow': '#f1fa8c'
}

const configMap = {
    parentElement: '#vizMap',
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.65,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    boundedWidth: undefined,
    boundedHeight: undefined,
}

// slider options
const slider = document.querySelector('#yearSlider')
const sliderValueSpan = document.querySelector('#rangeValue')
sliderValueSpan.innerHTML = currentYear;
slider.value = currentYear

slider.addEventListener('input', (e) => {
    sliderValueSpan.innerHTML = e.target.value;
})
slider.addEventListener('change', (e) => {
    sliderValueSpan.innerHTML = e.target.value;
})

async function drawViz() {

    /* [1] ===== ACCESS DATA ===== */
    // Load world data
    const worldData = await d3.json('./data/world.geo.json');
    const demographicsData = await d3.csv('./data/SP.POP.TOTL.FE.csv')
    const wblData = await d3.dsv(";", "./data/WBL-panel.csv")

    mergedData = transformData(wblData, worldData, demographicsData, currentYear);

    console.log(worldData)
    console.log(demographicsData)
    console.log(mergedData)

    yearMap = GetEvolutionSpeed(wblData)

    // init my data object
    const configData = {
        minYear: yearMap.entries().next().value[0],
        maxYear: yearMap.entries().next().value[1],
        currentYear: 2000,
        minIndex: Math.floor(d3.min(wblData, (d) => +d.WBL_INDEX.replace(",", "."))),
        maxIndex: Math.ceil(d3.max(wblData, (d) => +d.WBL_INDEX.replace(",", "."))),
        dataAccessors: {color: 'scoring.wbl_index'}
    }

    /* [2] ===== CHART DIMENSION ===== */
    configMap.boundedWidth = configMap.width - configMap.margin.left - configMap.margin.right;
    configMap.boundedHeight = configMap.height - configMap.margin.top - configMap.margin.bottom;

    //configData.dataAccessors.color = null;
    map = new Map(mergedData, configMap, configData)
    map.updateMap();
    
}

drawViz();
