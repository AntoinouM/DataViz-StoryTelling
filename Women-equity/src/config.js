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

const configBarchart = {
    parentElement: '#vizMap',
    width: window.innerWidth * 0.6,
    height: window.innerHeight * 0.4,
    margin: {
        top: 20,
        right: 35,
        bottom: 35,
        left: 20
    },
    colors: colors,
    boundedWidth: undefined,
    boundedHeight: undefined,
}


export { configMap, configBarchart, colors }