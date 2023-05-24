import _, { forEach, lte } from 'lodash';

/**
 * The function will grab the current year data from both sets and merges them
 * by their iso-3 string in order to create one array of objects.
 * @param {*} wblData 
 * @param {*} worldData 
 * @param {*} currentYear 
 */

export const GetEvolutionSpeed = (wblData) => {

    wblData =  wblData.map( (rows) => {
        return {
            economy: rows['Economy'],
            iso_code: rows['ISO_Code'],
            region: rows['Region'],
            income_group: rows['Income_Group'],
            report_year: rows['Report_Year'],
            wbl_index: +rows['WBL_INDEX'].replace(",", ".")
        }
    })               

    let years = [];
    wblData.forEach(element => {
        years.push(element.report_year)
    });

    let maxYear = Math.max.apply(null, years)
    let minYear = Math.min.apply(null, years)

    const filteredDataMaxYear = _.chain(wblData.filter((e) => +e.report_year === maxYear))
        .groupBy('region')
        .map((group, key) => ({ key, val : _.meanBy(group, 'wbl_index') }))
        .value();

    const filteredDataMinYear = _.chain(wblData.filter((e) => +e.report_year === minYear))
        .groupBy('region')
        .map((group, key) => ({ key, val : _.meanBy(group, 'wbl_index') }))
        .value();

    let diffMap = new Map();
    let spdMap = new Map();
    let remainTime = new Map();


    for (let i = 0; i < filteredDataMaxYear.length; i++) {
        diffMap.set(filteredDataMaxYear[i].key, (filteredDataMaxYear[i].val - filteredDataMinYear[i].val).toFixed(2))
        let averageProgressByYear = (filteredDataMaxYear[i].val - filteredDataMinYear[i].val)/(maxYear-minYear)
        spdMap.set(filteredDataMaxYear[i].key, averageProgressByYear.toFixed(2))
        let diffTo100 = 100 - (+filteredDataMaxYear[i].val);
        remainTime.set(filteredDataMaxYear[i].key, Math.ceil(+diffTo100/+averageProgressByYear))
    }

    let yearMap = new Map();
    yearMap.set(minYear, filteredDataMinYear)
    yearMap.set(maxYear, filteredDataMaxYear)
    yearMap.set("difference", diffMap)
    yearMap.set("changeRate", spdMap)
    yearMap.set("remainTime", remainTime)

    return yearMap;
}

export const transformData = (wblData, worldData, demographicData, year) => { // we use liodash to simplify the code {vanilla: filter both array then merge}, lodash work with sequence like d3 works with select
    
    const mappedWBL = wblData.map( (rows) => {
        return {
            scoring: {    
                economy: rows['Economy'],
                iso_code: rows['ISO_Code'],
                region: rows['Region'],
                income_group: rows['Income_Group'],
                report_year: rows['Report_Year'],
                wbl_index: +rows['WBL_INDEX'].replace(",", "."),
                indicators: {
                    mobility : +rows['MOBILITY'],
                    workplace: +rows['WORKPLACE'],
                    pay: +rows['PAY'],
                    marriage: +rows['MARRIAGE'],
                    parenthood: +rows['PARENTHOOD'],
                    entrepreneurship: +rows['ENTREPRENEURSHIP'],
                    assets: +rows['ASSETS'],
                    pension: +rows['PENSION'],
                    passport: rows['passport?']
                }
            }
        }
    })
    
    const filteredData = mappedWBL.filter( (e) => +e.scoring.report_year === year);
    const filteredDemographics = demographicData.map(d => {
        return {
            country_code: d['Country_Code'],
            women_population: d[`${year}`]
        }
    })
    

    const mergedData = _(filteredData)                              // start sequence (start with this array)
        .keyBy('scoring.iso_code')                                  // Create a dictionary (TKey, TValue) of the first array
        .merge(_.keyBy(worldData.features, 'properties.iso_a3'))    // Create a dictionary of the second array and merge it to the first one
        .merge(_.keyBy(filteredDemographics, 'country_code'))   
        .values()                                                   // convert the combined dictionaries to an array again
        .value()                                                    // get the value (array) of the sequence that is returned by lodash
    return mergedData;
}

export const AddScrollScore = (elementName, objectScore) => {

    const element = document.querySelector(elementName)

    objectScore = {
        parent: element,
        score: 0,
        lastDirUp: undefined
    }

    element.addEventListener('wheel', checkScrollDirection);

        function checkScrollDirection(event) {    
            if (checkScrollDirectionIsUp(event)) {
                objectScore.score++;
                objectScore.lastDirUp = -1;
            } else {
                if (objectScore.score > 0) {
                    objectScore.score--;  
                } else objectScore.score = 0
                objectScore.lastDirUp = 1; 
            }

        function checkScrollDirectionIsUp(event) {
            if (event.wheelDelta) {
                return event.wheelDelta > 0;
            } else {
            return event.deltaY < 0;
            }
        }
    }   
    return objectScore;
}


