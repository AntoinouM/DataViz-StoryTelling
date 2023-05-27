import Barchart from "../visualizations/Barchart"
import { configBarchart } from "./config"

const GLOBAL = {
    currentCountry : {
        code: undefined,
        name: undefined,
        data: undefined,
        dataBarchart: [],
        dataQuestions: undefined,
        currentYear: undefined,
        yearMap: undefined,
        dataSets: undefined,

        drawBarchart: function() {    
            this.dataBarchart = []
            for (const [key, value] of Object.entries(this.data[0].scoring.indicators)) {
                this.dataBarchart.push({'key': key, 'val': value})
            }
            console.log(this.dataBarchart)
            
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
            //this.dataBarchart = Array.from(this.data[0].scoring.indicators);
            this.dataQuestions = this.data[0].questions;

            const barchart = new Barchart(configBarchart.country, configData, this.dataBarchart)
            barchart.update();
        }
    },
}

export {GLOBAL}