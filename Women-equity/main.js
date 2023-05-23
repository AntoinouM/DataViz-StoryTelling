import './style.css';
import * as d3 from 'd3';
import { QuestionMap } from './src/global.js';

// import helping function from utils
import {
    transformData,
    GetEvolutionSpeed
} from './src/util.js';
import { merge } from 'lodash';

/**
 * Setting up const & variables
 */
let currentYear = 2021;
let mergedData;

const dimensions = {
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.65,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    boundedWidth: undefined,
    boundedHeight: undefined,
}

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

/* ======= CHART CHECKILIST ========
- [1] `Access data` -- Define how we access the values
- [2] `Create chart dimensions` -- Declare the physical chart parameters
- [3] `Draw canvas` -- Render the wrapper and bounds element
- [4] `Create scales` -- Create scales for every visualized attribute
- [5] `Draw data` -- Render the data elements
- [6] `Draw peripherals` -- Render the axes, labels, legends, annotations, etc
- [7] `Set up interactions` -- Initialize event listeners and create interaction behavior
*/

// easier to work with asynch / await
async function drawChart() {

    /* [1] ===== ACCESS DATA ===== */
    // Load world data
    const worldData = await d3.json('./data/world.geo.json');
    const demographicsData = await d3.csv('./data/SP.POP.TOTL.FE.csv')
    const wblData = await d3.dsv(";", "./data/WBL-panel.csv")

    mergedData = transformData(wblData, worldData, demographicsData, currentYear);
    const yearMap = GetEvolutionSpeed(wblData)

    // Define accessor functions
    //const yAccessor = d => d.item 
    //const xAccessor = d => 

    /* [2] ===== CHART DIMENSION ===== */
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    
    /* [3] ===== DRAW CANVAS ===== */
    const wrapper = d3.select('#viz')

    const svg = d3.select('#viz')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
    const viz = svg.append('g')
        .attr('class', 'line-chart')
        .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)

    /* [4] ===== CREATE SCALE ===== */


    /* [5] ===== DRAW DATA ===== */

    /* [6] ===== DRAW PERIPHERALS ===== */

    // =====================================
    /* [7] ===== SET UP INTERACTION ===== */
    // =====================================
}

drawChart();