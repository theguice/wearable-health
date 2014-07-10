var w = 500,
	h = 500;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Average Healthy Person', 'Me'];


//Data
var d = [
		  [
			{axis:"Stand",value:0.70},
			{axis:"Sit",value:0.6},
			{axis:"Lay",value:0.60},
			{axis:"Steps",value:0.35},
			{axis:"Sleep",value:0.60},
		  ],[
			{axis:"Stand",value:0.7},
			{axis:"Sit",value:0.3},
			{axis:"Lay",value:0.50},
			{axis:"Steps",value:0.80},
			{axis:"Sleep",value:0.20},
		  ]
		];

/*
var d = [
		  [
			{axis:"Sit Bad LF",value:0.6},
			{axis:"Sit Bad LB",value:0.7},
			{axis:"Sit Bad RF",value:0.4},
			{axis:"Sit Bad RB",value:0.5},
			{axis:"Sit Bad F",value:0.2},
			{axis:"Sit Bad B",value:0.34},
		  ]
		];
		*/

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("Individual Stat Scores");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	
