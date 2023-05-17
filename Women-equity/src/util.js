import _, { lte } from 'lodash';

/**
 * The function will grab the current year data from both sets and merges them
 * by their iso-3 string in order to create one array of objects.
 * @param {*} wblData 
 * @param {*} worldData 
 * @param {*} currentYear 
 */

export const transformData = (wblData, worldData, demographicData, year) => { // we use liodash to simplify the code {vanilla: filter both array then merge}, lodash work with sequence like d3 works with select
    
    const mappedWBL = wblData.map( (rows) => {
        return {
            scoring: {    
                economy: rows['Economy'],
                iso_code: rows['ISO_Code'],
                region: rows['Region'],
                income_group: rows['Income_Group'],
                report_year: rows['Report_Year'],
                wbl_index: rows['WBL_INDEX'],
                indicators: {
                    mobility : rows['MOBILITY'],
                    workplace: rows['WORKPLACE'],
                    pay: rows['PAY'],
                    marriage: rows['MARRIAGE'],
                    parenthood: rows['PARENTHOOD'],
                    entrepreneurship: rows['ENTREPRENEURSHIP'],
                    assets: rows['ASSETS'],
                    pension: rows['PENSION'],
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

export const AddScrollScore = (element, objectScore) => {

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

export const AnimationEffect = (elementsArray, options) => {

    let animParam = {
        delay: 1.5
    }

    elementsArray.forEach(element => {
        // add all the transition

        return {
            appear: (element) => {
                let op = 0.1;  // initial opacity
                element.style.display = 'block';
                let timer = setInterval(function () {
                    if (op >= 1){
                        clearInterval(timer);
                    }
                    element.style.opacity = op;
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op += op * 0.1;
                }, animParam.delay);
            },
            disappear: (element) => {},
            expand: (element) => {},
        }
    });

}

