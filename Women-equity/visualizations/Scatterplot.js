import * as d3 from 'd3';

class Scatterplot {
    constructor(data, config) {
        this.data = data

        this.config = {
            parentElement: config.parentElement || '#vizBubbleChart',
            colorScale: config.colorScale,
            width: config.width || 500,
            height: config.height || 400,
            margin: config.margin || {
                top: 25,
                right: 20,
                bottom: 30,
                left: 30
            },
            bandArray: config.bandArray,
            tooltipPadding: config.tooltipPadding || 15,
            xAxisText: config.xAxisText || 'Distance',
            yAxisText: config.yAxisText || 'Time',
            dataAccessors: config.dataAccessors || {
                param2check: 'scoring',
                color: 'difficulty',
                x: 'distance',
                y: 'time'
            },
        };

        this.initViz(); // Create the chart
    }

    // Initializes the scale, axes, appends static elements (axis, title...)
    initViz() {
        const that = this;

        // Calculate the inner bounds
        that.boundedWidth = that.config.width - that.config.margin.left - that.config.margin.right;
        that.boundedHeight = that.config.height - that.config.margin.top - that.config.margin.bottom;

        // Initialize scales
        that.xScale = d3.scaleLog()
            .range([0, that.boundedWidth]);
        that.yScale = d3.scaleLinear()
            .range([that.boundedHeight, 0]);
        // color
        that.colorScale = d3.scaleOrdinal()
            .range(that.config.colorScale)
            .domain(that.config.bandArray);
        // size R
        that.sqrtScale = d3.scaleSqrt()
            .range([3, 30]);

        
        // Initialize axes
        that.xAxis = d3.axisBottom(that.xScale)
            .tickSize(0)
        that.yAxis = d3.axisLeft(that.yScale)
            .ticks(6)
            .tickSize(-that.boundedWidth - 10)
            .tickPadding(10)

        // Initialize the svg
        that.svg = d3.select(that.config.parentElement)
            .append('svg')
            .attr('width', that.config.width)
            .attr('height', that.config.height);
        // Initialize the real drawing area
        that.viz = that
            .svg.append('g')
            .attr('transform', `translate(
                    ${that.config.margin.left},
                    ${that.config.margin.top}
            )`);

        /**
         * STATIC ELEMTS
         */

        // axes
        that.xAxisG = that.viz.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${that.boundedHeight})`);
        that.yAxisG = that.viz.append('g')
            .attr('class', 'axis y-axis');

        // titles for both axes
        that.xAxisG.append('text')
            .attr('class', 'title axis-title')
            .attr('x', that.boundedWidth + 10)
            .attr('y', -15)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text(that.config.xAxisText)
        that.yAxisG.append('text')
            .attr('class', 'title axis-title')
            .attr('x', 5)
            .attr('y', -25)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text(that.config.yAxisText)
    }

    // updating all the dynamic propreties (x/y domain...)
    updateViz() {
        const that = this;
    
        that.colorAccessor = d => d.region
        that.xAccessor = d => d.gdp;
        that.yAccessor = d => d.wbl_index;
        that.rAccessor = d => d.women_population

        // Set the domains for scales
        that.xScale.domain([100000000, d3.max(that.data, d => that.xAccessor(d))]);
        that.yScale.domain([0, 100]);
        that.sqrtScale.domain([0, d3.max(that.data, d => that.rAccessor(d))]);

        this.renderViz(); // Render the vizualisation
    }

    // render the visualization
    renderViz() {
        const that = this;

        // Add circles
        const circles = that.viz.selectAll('circle')
            .data(that.data)
            .join('circle')
                .attr('class', 'point')
                .attr('cx', d => that.xScale(d.gdp))
                .attr('cy', d => that.yScale(120))
                .attr('fill', d => that.colorScale(d.region))
                .transition()
                    .duration(800)
                    .delay(function(d,i) {
                        return i * 10
                    })
                    .ease(d3.easeCubicIn)
                    .attr('cy', d => that.yScale(d.wbl_index))
                    .attr('r', d => that.sqrtScale(d.women_population))

        // Create the axes
        that.xAxisG
            .call(that.xAxis)

        that.yAxisG
            .call(that.yAxis)
        
        that.yAxisG.selectAll(".tick line")
            .attr("stroke", '#6272a4');  
    }

}

export default Scatterplot;