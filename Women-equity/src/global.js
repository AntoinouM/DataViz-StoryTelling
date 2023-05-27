import Barchart from "../visualizations/Barchart"
import { configBarchart } from "./config"

const GLOBAL = {
    yearMap: undefined,
    currentIndicator: {
        name: undefined,
        questions: undefined,
    },
    currentCountry : {
        code: undefined,
        name: undefined,
        data: undefined,
        dataBarchart: [],
        dataQuestions: undefined,
        currentYear: undefined,
        dataSets: undefined,
        drawBarchart: function(DOMelem) {    
            this.dataBarchart = []
            for (const [key, value] of Object.entries(this.data[0].scoring.indicators)) {
                this.dataBarchart.push({'key': key, 'val': value})
            }
            
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

            // clear first child
            if (DOMelem.firstElementChild) {
                DOMelem.firstElementChild.remove();
            }

            const barchart = new Barchart(configBarchart.country, configData, this.dataBarchart)
            barchart.update();
        }
    },
}

export {GLOBAL}