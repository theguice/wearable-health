/* Top bars are actually generating a separate svg canvas for each parameter. 
 
 I find that a 100px width works well for spacing them evenly across the page; feel free to modify that of course
 
 
 See comments below about the compare tool
*/


/*
top_bars("heartrate");
top_bars("steps");
top_bars("calories");
top_bars("gsr");
top_bars("skin_temp");
top_bars("air_temp");

^
|
|
Judged by Shubham

*/
var topBarSensors = ["heartrate","steps","calories","gsr","skin_temp","air_temp"];
var topBarData = new Array();
var topBarRanges = {"heartrate":[0,200],
					"steps":[0,100],
					"calories":[0,20],
					"gsr":[0,2],
					"skin_temp":[0,200],
					"air_temp":[0,200]};

for (i = 0; i < topBarSensors.length; i++)
{
	topBarData[topBarSensors[i]] = new Array();
	initTopBar(topBarSensors[i]);
/* 	top_bars(topBarSensors[i]); */
}

function top_bars(param) {


    /* 
    This is where we will do the drawing of the compare tool.
    
    This api call url is where you'll need to add the start_time and end_time parameters for each time range that should be compared. So it will end up looking something like:
    
    /api/parameter_averages.php?"+param+"=1&s_time1=... e_time1=... s_time2=... e_time2=...
    
    
    if one row comes back (which is currently the default), d3 draws one bar
    if two rows come back, d3 draws the two bars side by side
    and so on...
    
    you'll need to modify parameter_averages.php to understand s_time1, s_time2...
        I made more comments in that file about this 
    
    
    */
	    
}

function addCompareRangeToTopBar()
{
	console.log('addCompareRangeToTopBar');
	for (i = 0; i < topBarSensors.length; i++)
	{
	    var param = topBarSensors[i];
		d3.json($base_url + "/api/parameter_averages.php?"+param+"=1&start_time="+startDateEpoc+"&end_time="+endDateEpoc, function(error, data)
		{
			console.log(data[0].name+":"+data[0].value);
		    topBarData[data[0].name].push(data[0].value);
/* 		    animateAndUpdateTopbar(data[0].name); */
		});

	}
}


var bar_margin = {top: 0, right: 0, bottom: 30, left: 0},
    bar_width = 100 - bar_margin.left - bar_margin.right,
    bar_height = 120 - bar_margin.top - bar_margin.bottom;

function initTopBar(sensor)
{
    var svg_bar = d3.select("div."+sensor).append("svg")
		.attr("width", 100)
		.attr("height", 120)
		.append("g")
		.attr("class", sensor)
		.attr("transform", "translate(" + 0 + "," + 0 + ")");
        //TODO: update weight and height from parameters
    
    // start data dowload> which will update the charts automatically
    d3.json($base_url + "/api/parameter_averages.php?"+sensor+"=1", function(error, data) {
	    topBarData[data[0].name].push(data[0].value);
	    // update the bar charts
	    animateAndUpdateTopbar(data[0].name);
	});

}

function animateAndUpdateTopbar(sensor)
{

	var data = topBarData[sensor];

	var bar_x = d3.scale.ordinal()
	    .rangeRoundBands([30, bar_width], .1)
	    .domain(d3.range(data.length));
	
	var bar_y = d3.scale.linear()
	    .range([bar_height-5, 10])
	    .domain([topBarRanges[sensor][0], topBarRanges[sensor][1]]);
	
    var xAxis = d3.svg.axis()
        .scale(bar_x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(bar_y)
        .orient("left")
        .ticks(1);

	var svg_bar = d3.select("g."+sensor);
	
    svg_bar.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(30,20)")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end");

	svg_bar.selectAll("foreignObject")
		.data(data)
		.enter()
		.append("foreignObject")
		.attr('x', '30')
		.attr('y', '0')
		.html(function(d,i) { return "<label class='checkbox'><input type='checkbox' id='option_" + sensor + "' ></input>" + sensor + "</label>"; });

	svg_bar.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d,i) { return bar_x(i); })
		.attr("width", bar_x.rangeBand())
		.attr("y", function(d) { return bar_y(d); })
		.attr("height", function(d) { return bar_height - bar_y(d) + 15; });
/*
	var bars = svg_bar.selectAll(".bar")
				.data(data);
	
    bars.enter()
        .append("rect")
        .attr("class", "bar");
*/

/*
	bars
		.transition()
		.duration(300)
		.ease("quad")
		    .attr("width", x.rangeBand())
		    .attr("height", function(d) { return height - bar_y(d.value) + 15; })
		    .attr("transform", function(d,i) {
		        return "translate(" + [bar_x(i), 0] + ")"
		    });
*/
}

