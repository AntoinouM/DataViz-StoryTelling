import './styles/style.css';
import * as d3 from 'd3';
import {
    GLOBAL
} from './src/global.js';
import Map from './visualizations/Map'
import Barchart from './visualizations/Barchart';
import BacktoBack from './visualizations/BacktoBack';
import Scatterplot from './visualizations/Scatterplot';
import {
    transformData,
    AddScrollScore,
    generateYearMap,
    getMeanIndicatorsGlobal,
    solidifiedData
} from './src/util.js';
import {
    configMap,
    configYesNoMap,
    configBackgroundMap,
    configBackgroundMap2,
    configBarchart,
    configScatterPlot,
    colors
} from './src/config.js'
import {
    forEach
} from 'lodash';

// WHY DO I NEED TO GO TO TOP OF PAGE???
document.querySelector('#backtoback').scrollIntoView({
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
let scatter;
let dispatcher;


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

    dispatcher = d3.dispatch('filterRegion')
    mergedData = transformData(GLOBAL.dataSets, GLOBAL.currentYear);
    GLOBAL.yearMap = generateYearMap(wblData)
    visualizeTotalNumber(demographicsData, wblData);
    drawBackgroundMap(GLOBAL.dataSets)
    drawYesNoMap(GLOBAL.dataSets);

    // console.log(worldData)
    // console.log(demographicsData)
    // console.log(mergedData)

    // on click go back
    onCLickUpdateAndScroll('#goMapFirst', '#yesNoMapSection')
    onCLickUpdateAndScroll('#yesNoMapSection', '#butWaitSection')
    onCLickUpdateAndScroll('#goMapSecond', '#map-section')
    onCLickUpdateAndScroll('#return-map', '#map-section')
    onCLickUpdateAndScroll('#return-map2', '#map-section')
    onCLickUpdateAndScroll('.goUp', '#intro')
    onCLickUpdateAndScroll('#goNext', '#backtoback')
    // Manage scrolling event for barchart year
    addScrollingEventYear()
    // Bar chart scroll to next
    let scrollingBarChart;
    scrollingBarChart = AddScrollScore('#bar-chart', scrollingBarChart, null)

    //scrollTo(scrollingBarChart, document.querySelector('#backtoback'))


    drawMap(GLOBAL.dataSets);
    drawBackToBack();
    drawScatter(GLOBAL.dataSets, configScatterPlot)

    dispatcher.on('filterRegion', selected => {
        GLOBAL.yearMap.data.maxYear.forEach(element => {
            configScatterPlot.bandArray.push(element.key)
        })
        configScatterPlot.bandArray.sort();
    
        const dataNew = solidifiedData(GLOBAL.dataSets, 2021)
        if (selected.length === 0) {
            scatter.setData(dataNew)
        } else {
            const filteredData = dataNew.filter(e => selected.includes(e.region))
            scatter.setData(filteredData)
        }

        scatter.updateViz();
    })
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

function visualizeTotalNumber(demographicsData, wblData) {
    // Filter the questions data for the year 2023 and the specified question
    const filteredQuestions = wblData.filter(function (data) {
        return data["Can a woman work in an industrial job in the same way as a man?"] === "No" && data["Report_Year"] === "2020";
    });


    // Get the list of countries with "No" answer to the question
    const countriesWithAnswerNo = filteredQuestions.map(function (data) {
        return data["Economy_Code"];
    });

    // Filter the population data for female population in the specified countries
    const filteredPopulation = demographicsData.filter(function (data) {
        return countriesWithAnswerNo.includes(data["Country_Code"]) && data["Indicator Name"] === "Population, female";
    });

    // Calculate the total female population in the specified countries
    const totalFemalePopulation = filteredPopulation.reduce(function (total, data) {
        return total + parseFloat(data["2020"]);
    }, 0);

    const totalNumberElement = document.getElementById("totalNumber");

    /**
     * ANIMATION
     */

    // Set the initial value to 0
    let currentValue = 0;

    // Define the increment step and interval duration (in milliseconds)
    const increment = Math.ceil(totalFemalePopulation / 100);
    const intervalDuration = 20;

    // Define the interval function
    const incrementValue = () => {
        currentValue += increment;
        if (currentValue >= totalFemalePopulation) {
            // Ensure the final value is displayed without exceeding the total
            totalNumberElement.innerText = totalFemalePopulation.toLocaleString();
            clearInterval(interval);
        } else {
            totalNumberElement.innerText = currentValue.toLocaleString();
        }
    };

    // Start the animation
    const interval = setInterval(incrementValue, intervalDuration);
}

function drawScatter(dataSets, config) {
    GLOBAL.yearMap.data.maxYear.forEach(element => {
        config.bandArray.push(element.key)
    })
    config.bandArray.sort();

    const dataNew = solidifiedData(dataSets, 2021)
    scatter = new Scatterplot(dataNew, config)
    scatter.updateViz()
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
    barchartHorizontal = new BacktoBack(configBarchart.region, configData, GLOBAL.yearMap, dispatcher)
    barchartHorizontal.update()
}

function drawBackgroundMap(dataSets) {
    const configData = {
        dataAccessors: {
            paramToCheck: 'empty_map',
            color: null,
        },
        sliderGetter: null,
    }

    // Create the map object
    map = new Map(configBackgroundMap, configData, dataSets, 2021);
    map.updateMap();

    // Create the map object
    map = new Map(configBackgroundMap2, configData, dataSets, 2021);
    map.updateMap();
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
            paramToCheck: 'scoring',
            color: 'wbl_index'
        },
        sliderGetter: {
            'input': '#yearSlider',
            'span': '#rangeValue',
            'btn': '#playBtn',
        },
        domain: undefined
    }

    configData.domain = [configData.minIndex, configData.maxIndex]


    // Create the map object
    map = new Map(configMap, configData, dataSets, GLOBAL.currentYear);

    // Draw the map
    map.updateMap();
}

function drawYesNoMap(dataSets) {
    const configData = {
        minIndex: 'Yes',
        maxIndex: 'No',
        dataAccessors: {
            paramToCheck: 'questions',
            color: "pay['Can a woman work in an industrial job in the same way as a man?']"
        },
        sliderGetter: null,
        domain: ['Yes', 'No']
    }

    // Create the map object
    map = new Map(configYesNoMap, configData, dataSets, 2021);
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
    observeYear(document.getElementById('selected'), {
        attributes: true,
        childList: true,
        subtree: true
    })

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