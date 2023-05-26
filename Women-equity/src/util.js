import _, { forEach, lte } from 'lodash';
import * as d3 from 'd3';

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
    
    let years = new Set();
    wblData.forEach((element, index) => {
        if (!element.wbl_index) wblData.splice(index, 1)
        years.add(element.report_year)
    });

    years = Array.from(years)
  
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

    let remainTime = new Map();


    for (let i = 0; i < filteredDataMaxYear.length; i++) {
        let averageProgressByYear = (filteredDataMaxYear[i].val - filteredDataMinYear[i].val)/(maxYear-minYear)
        let diffTo100 = 100 - (+filteredDataMaxYear[i].val);
        remainTime.set(filteredDataMaxYear[i].key, Math.ceil(+diffTo100/+averageProgressByYear))
    }

    let yearMap = {
        years: {
            min: minYear,
            max: maxYear,
        },
        data: {
            minYear: filteredDataMinYear,
            maxYear: filteredDataMaxYear,
        },
        'remainingTime': remainTime,
    }

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
            },
    questions: {
        mobility: {
            'Can a woman choose where to live in the same way as a man?': rows['Can a woman choose where to live in the same way as a man?'],
            'Can a woman travel outside her home in the same way as a man?': rows['Can a woman travel outside her home in the same way as a man?'],
            'passport?': rows['passport?'],
            'Can a woman travel outside the country in the same way as a man?': rows['Can a woman travel outside the country in the same way as a man?'],
        },
        workplace: {
            'Can a woman get a job in the same way as a man?': rows['Can a woman get a job in the same way as a man?'],
            'Does the law prohibit discrimination in employment based on gender?': rows['Does the law prohibit discrimination in employment based on gender?'],
            'Is there legislation on sexual harassment in employment?': rows['Is there legislation on sexual harassment in employment?'],
            'Are there criminal penalties or civil remedies for sexual harassment in employment?': rows['Are there criminal penalties or civil remedies for sexual harassment in employment?'],
        },
        pay: {
            'Does the law mandate equal remuneration for work of equal value?': rows['Does the law mandate equal remuneration for work of equal value?'],
            'Can a woman work at night in the same way as a man?': rows['Can a woman work at night in the same way as a man?'],
            'Can a woman work in a job deemed dangerous in the same way as a man?': rows['Can a woman work in a job deemed dangerous in the same way as a man?'],
            'Can a woman work in an industrial job in the same way as a man?': rows['Can a woman work in an industrial job in the same way as a man?'],
        },
        marriage: {
            'Is the law free of legal provisions that require a married woman to obey her husband?': rows['Is the law free of legal provisions that require a married woman to obey her husband?'],
            'Can a woman be head of household in the same way as a man?': rows['Can a woman be head of household in the same way as a man?'],
            'Is there legislation specifically addressing domestic violence?': rows['Is there legislation specifically addressing domestic violence?'],
            'Can a woman obtain a judgment of divorce in the same way as a man?': rows['Can a woman obtain a judgment of divorce in the same way as a man?'],
            'Does a woman have the same rights to remarry as a man?': rows['Does a woman have the same rights to remarry as a man?'],
        },
        parenthood: {
            'Is paid leave of at least 14 weeks available to mothers?': rows['Is paid leave of at least 14 weeks available to mothers?'],
            'Length of paid maternity leave': rows['Length of paid maternity leave'],
            'Does the government administer 100% of maternity leave benefits?': rows['Does the government administer 100% of maternity leave benefits?'],
            'Is there paid leave available to fathers?': rows['Is there paid leave available to fathers?'],
            'Length of paid paternity leave': rows['Length of paid paternity leave'],
            'Is there paid parental leave?': rows['Is there paid parental leave?'],
            'Shared days': rows['Shared days'],
            'Days for the mother': rows['Days for the mother'],
            'Days for the father': rows['Days for the father'],
            'Is dismissal of pregnant workers prohibited?': rows['Is dismissal of pregnant workers prohibited?'],
        },
        entrepreneurship: {
            'Does the law prohibit discrimination in access to credit based on gender?': rows['Does the law prohibit discrimination in access to credit based on gender?'],
            'Can a woman sign a contract in the same way as a man?': rows['Can a woman sign a contract in the same way as a man?'],
            'Can a woman register a business in the same way as a man?': rows['Can a woman register a business in the same way as a man?'],
            'Can a woman open a bank account in the same way as a man?': rows['Can a woman open a bank account in the same way as a man?'],
        },
        assets: {
            'Do men and women have equal ownership rights to immovable property?': rows['Do men and women have equal ownership rights to immovable property?'],
            'Do sons and daughters have equal rights to inherit assets from their parents?': rows['Do sons and daughters have equal rights to inherit assets from their parents?'],
            'Do male and female surviving spouses have equal rights to inherit assets?': rows['Do male and female surviving spouses have equal rights to inherit assets?'],
            'Does the law grant spouses equal administrative authority over assets during marriage?': rows['Does the law grant spouses equal administrative authority over assets during marriage?'],
            'Does the law provide for the valuation of nonmonetary contributions?': rows['Does the law provide for the valuation of nonmonetary contributions?'],
        },
        pension: {
            'Is the age at which men and women can retire with full pension benefits the same?': rows['Is the age at which men and women can retire with full pension benefits the same?'],
            'Is the age at which men and women can retire with partial pension benefits the same?': rows['Is the age at which men and women can retire with partial pension benefits the same?'],
            'Is the mandatory retirement age for men and women the same?': rows['Is the mandatory retirement age for men and women the same?'],
            'Are periods of absence due to childcare accounted for in pension benefits?': rows['Are periods of absence due to childcare accounted for in pension benefits?'],
        },
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





