import Barchart from "../visualizations/Barchart"
import { configBarchart } from "./config"
import { transformData } from "./util"

const GLOBAL = {
    yearMap: undefined,
    currentIndicator: {
        name: 'mobility',
        questions: undefined,
        updateHtmlQuestions: function(DOM) {
            let entriesarr = Object.entries(GLOBAL.currentIndicator.questions)

            let html = `<ul>`
            for (let i = 0; i < entriesarr.length; i++) {
              html += `<li>${entriesarr[i][0]}  <b>${entriesarr[i][1]}</b></li>`
            }
            html+=`</u>`
            DOM.innerHTML = html;
          }
    },
    currentCountry : {
        code: undefined,
        name: undefined,
        data: undefined,
        dataUpdate: function () {
            this.data = transformData(GLOBAL.dataSets.wbl, GLOBAL.dataSets.map, GLOBAL.dataSets.demo, GLOBAL.currentYear, GLOBAL.currentCountry.name)
        },
        dataBarchart: [],
        dataQuestions: undefined,
        currentYear: undefined,
        dataSets: undefined,
        drawBarchart: function(DOMelem) {    
            this.dataBarchart = []
            
            // create a barchart specific data object
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

            this.dataQuestions = this.data[0].questions;

            // clear first child
            if (DOMelem.firstElementChild) {
                DOMelem.firstElementChild.remove();
            }

            const barchart = new Barchart(configBarchart.country, configData, this.dataBarchart)
            barchart.update();
        }
    },
    updateSliderElement: function(d3) {
        d3.select('#selected').html(GLOBAL.currentYear) 

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

export {GLOBAL}