import Barchart from "../visualizations/Barchart"
import { configBarchart } from "./config"
import { transformData } from "./util"

const GLOBAL = {
    yearMap: undefined,
    currentIndicator: {
        name: 'mobility',
        questions: undefined,
        updateHtmlQuestions: function() {
            let entriesarr = Object.entries(GLOBAL.currentIndicator.questions)
            
            const questionsDiv = document.getElementById('questions')
            questionsDiv.style.display = 'block'
            let html = `<ul>`
            for (let i = 0; i < entriesarr.length; i++) {
              html += `<li>${entriesarr[i][0]}  <b>${entriesarr[i][1]}</b></li>`
            }
            html+=`</u>`
            questionsDiv.innerHTML = html;
          }
    },
    currentCountry : {
        code: undefined,
        name: undefined,
        data: undefined,
        dataUpdate: function () {
            GLOBAL.currentCountry.data = transformData(GLOBAL.dataSets.wbl, GLOBAL.dataSets.map, GLOBAL.dataSets.demo, GLOBAL.currentYear, GLOBAL.currentCountry.name)
        },
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