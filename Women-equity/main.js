import './style.css';
import * as d3 from 'd3';

// import helping function from utils
import {
    transformData,
    AddScrollScore,
    AnimationEffect
} from './src/util.js';

/**
 * Setting up const & variables
 */
let currentYear = 2000;
let bodyScrollScore;

bodyScrollScore = AddScrollScore(document.querySelector('body'), new Object)
let animTitle = AnimationEffect([document.querySelector('#reveal')])

document.querySelector('body').addEventListener('wheel', ()=> {
    console.log(AnimationEffect)
})

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

    const mergedData = transformData(wblData, worldData, demographicsData, currentYear);

    // Define accessor functions
    //const yAccessor = d => d.item 
    //const xAccessor = d => 

    /* [2] ===== CHART DIMENSION ===== */
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
