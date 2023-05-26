import Barchart from "../visualizations/Barchart"
import { configBarchart } from "./config"

const GLOBAL = {
    currentCountry : {
        code: undefined,
        name: undefined,
        data: undefined,
        currentYear: undefined,
        yearMap: undefined,
        dataSets: undefined,
        drawBarchart: function() {
            const configData = {
                xAxisTicks: '%',
                yAxisTicks: 'Indicator',
                maxValue: 100,
                bandArray: Object.keys(this.data[0].scoring.indicators),
                dataAccessors: {
                    color: 'key',
                    x: 'key',
                    y: 'val',
                }
            }

            const barchart = new Barchart(configBarchart, configData, this.dataSets, this.name)
            barchart.update();
        }
    },
}

export {GLOBAL}