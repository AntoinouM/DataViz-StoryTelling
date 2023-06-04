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
    width: window.innerWidth * 0.65,
    height: window.innerHeight * 0.65,
    margin: {
        top: 20,
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
    width: window.innerWidth * 0.65,
    height: window.innerHeight * 0.65,
    margin: {
        top: 20,
        right: 20,
        bottom: 35,
        left: 35
    },
    colors: colors,
    colorScale: ['#50fa7b', '#ff5555'],
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
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.5,
        margin: {
            top: 20,
            right: 35,
            bottom: 35,
            left: 20
        },
        colors: colors,
        colorScale: ['#8be9fd', '#ff79c6', '#50fa7b', '#ffb86c', '#f8f8f2', '#f1fa8c', '#ff5555'],
        boundedWidth: undefined,
        boundedHeight: undefined,
    },

    country: {
        parentElement: '#vizBarchart',
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.4,
        margin: {
            top: 20,
            right: 35,
            bottom: 35,
            left: 20
        },
        colors: colors,
        colorScale: null,
        boundedWidth: undefined,
        boundedHeight: undefined,
        orientationHorizontal: false,
    }

}

const configBackToBack = {
    parentElement: '#vizBacktoBack',
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.5,
    margin: {
        top: 20,
        right: 35,
        bottom: 35,
        left: 20
    },
    colors: colors,
    colorScale: ['#8be9fd', '#ff79c6', '#50fa7b', '#ffb86c', '#f8f8f2', '#f1fa8c', '#ff5555'],
    boundedWidth: undefined,
    boundedHeight: undefined,
    leftPart: {

    },
    rightPart: {

    },
}


export { configMap, configYesNoMap, configBackgroundMap, configBackgroundMap2, configBarchart, colors }