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

const configBarchart = {
    region: {
        parentElement: '#vizBarchart',
        width: window.innerWidth * 0.5,
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
        orientationHorizontal: false,
    },

    country: {
        parentElement: '#vizBarchart',
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.5,
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


export { configMap, configBarchart, colors }