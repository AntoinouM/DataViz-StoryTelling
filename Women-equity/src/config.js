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
    linkedElement: '#bar-chart',
    width: window.innerWidth * 0.55,
    height: window.innerHeight * 0.45,
    margin: {
        top: 0,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    colorScale: ['#bca0dc', '#663a82', '#3c1361'],
    boundedWidth: undefined,
    boundedHeight: undefined,
    clickable: true
}

const configYesNoMap = {
    parentElement: '#yesNoMap',
    linkedElement: '#secondBgMap',
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.5,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    colorScale: ['#50fa7b', '#B597F3'],
    boundedWidth: undefined,
    boundedHeight: undefined,
    clickable: false
}

const configBackgroundMap = {
    parentElement: '#firstBgMap',
    linkedElement: '#yesNoMap',
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    colorScale: false,
    boundedWidth: undefined,
    boundedHeight: undefined,
    clickable: false
}

const configBackgroundMap2 = {
    parentElement: '#secondBgMap',
    linkedElement: '#vizMap',
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    colorScale: false,
    boundedWidth: undefined,
    boundedHeight: undefined,
    clickable: false
}

const configBarchart = {
    region: {
        parentElement: '#vizBacktoBack',
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.35,
        margin: {
            top: 20,
            right: 0,
            bottom: 55,
            left: 35
        },
        colors: colors,
        colorScale: ['#8be9fd', '#ff79c6', '#50fa7b', '#ffb86c', '#f8f8f2', '#f1fa8c', '#ff5555'],
        boundedWidth: undefined,
        boundedHeight: undefined,
    },

    country: {
        parentElement: '#vizBarchart',
        width: window.innerWidth * 0.4,
        height: window.innerHeight * 0.3,
        margin: {
            top: 20,
            right: 35,
            bottom: 75,
            left: 25
        },
        colors: colors,
        colorScale: null,
        boundedWidth: undefined,
        boundedHeight: undefined,
        orientationHorizontal: false,
    }

}
const configScatterPlot = {
        parentElement: '#vizBubbleChart',
        colorScale: ['#8be9fd', '#ff79c6', '#50fa7b', '#ffb86c', '#f8f8f2', '#f1fa8c', '#ff5555'],
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.3,
        margin: {
            top: 40,
            right: 0,
            bottom: 35,
            left: 35
        },
        colors: colors,
        tooltipPadding: 15,
        xAxisText: 'GDP',
        yAxisText: 'WBL Index',
        bandArray: [],
        dataAccessors: {
            param2check: 'scoring',
            color:  'region',
            x: 'gdp',
            y: 'scoring.wbl_index'
        }
}

export { configMap, configYesNoMap, configBackgroundMap, configBackgroundMap2, configBarchart, colors, configScatterPlot }