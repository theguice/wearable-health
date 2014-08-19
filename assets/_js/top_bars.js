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
var initBarData = new Array();
var topBarData = new Array();
var topBarRanges = {"heartrate":[0,140],
					"steps":[0,10000],
					"calories":[0,5000],
					"gsr":[0,2],
					"skin_temp":[0,200],
					"air_temp":[0,200]};
var sensorName = {"heartrate":"Heart Rate",
					"steps":"Steps",
					"calories":"Calories",
					"gsr":"Perspiration",
					"skin_temp":"Skin Temp",
					"air_temp":"Air Temp"};

var bar_margin = {top: 10, right: 0, bottom: 30, left: 0},
    bar_width = 90 - bar_margin.left - bar_margin.right,
    bar_height = 128 - bar_margin.top - bar_margin.bottom;

var bar_x = d3.scale.ordinal();

function bar_y(sensor)
{
	var bar_scale = d3.scale.linear().range([bar_height, 0]).domain([topBarRanges[sensor][0], topBarRanges[sensor][1]]);
	return bar_scale;
}

function initTopBarAxis() {
	/* Get data ranges*/
	d3.json($base_url + "/api/get_parameter_ranges.php?user_id="+user_id.id, function(error, data) {
//	console.log("top bar range data received");
//	console.log(data);
		topBarRanges = data;
		initTopBarChart();
	});
}

function initTopBarChart() {
	for (i = 0; i < topBarSensors.length; i++)
	{
		initBarData[topBarSensors[i]] = new Array();
		topBarData[topBarSensors[i]] = new Array();
		initTopBar(topBarSensors[i]);
	}
	
	setTimeout(function() {
		$(".top").trigger('click');	
	}, 2000);
}

function initTopBar(sensor)
{
	var data = initBarData[sensor];

    var svg_bar = d3.select("div."+sensor).append("svg")
		.attr("width", bar_width)
		.attr("height", bar_height+10)
		.append("g")
		.attr("class", sensor)
		.attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");
	
	    bar_x.rangeRoundBands([10, bar_width], .2)
	    .domain(d3.range(data.length));
	    	
    var xAxis = d3.svg.axis()
        .scale(bar_x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(bar_y(sensor))
        .orient("left")
        .ticks(3);
        
    svg_bar.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(12,0)")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(0)")
		.attr("y", 6)
		.attr("dy", ".60em")
		.style("text-anchor", "end");
	svg_bar.selectAll("g.tick > text")
		.attr("transform", "translate(-5,5) rotate(90)")
		.attr("font-size","7px");

	var checked = (sensor == 'heartrate')?"checked":"";
	svg_bar.append("foreignObject")
		.attr('x', '14')
		.attr('y', '-12')
		.attr('width',bar_width)
		.attr('height',20)
		.html(function(d,i) { return "<label class='checkbox'><input type='checkbox' id='option_" + sensor + "' "+checked+"></input><span class='icon "+sensor+"'></span>" + sensorName[sensor] + "</label>"; });
    
    // start data dowload> which will update the charts automatically
    d3.json($base_url + "/api/parameter_averages.php?"+sensor+"=1&user_id="+user_id.id, function(error, data) {
	    initBarData[data[0].name].push(data[0].value);
	    // update the bar charts
	    animateAndUpdateTopbar(data[0].name,true);
	});

}

initTopBarAxis();

function addCompareRangeToTopBar()
{
	for (i = 0; i < topBarSensors.length; i++)
	{
	    var sensor = topBarSensors[i];
	    // user_id comes from main_graph.js
	    // console.log($base_url + "/api/parameter_averages.php?"+sensor+"=1&start_time="+startDateEpoc+"&end_time="+endDateEpoc+"&user_id="+user_id.id)
		d3.json($base_url + "/api/parameter_averages.php?"+sensor+"=1&start_time="+startDateEpoc+"&end_time="+endDateEpoc+"&user_id="+user_id.id, function(error, data)
		{
			if (data.length != 0) {
				topBarData[data[0].name].push(data[0].value);
				animateAndUpdateTopbar(data[0].name,false);
			}
		    
		});

	}
}


function animateAndUpdateTopbar(sensor, isFirstRun)
{
	var data = 0;
	if(isFirstRun)
	{
		data = initBarData[sensor];
	}else
	{
		data = topBarData[sensor];
	}
	
	bar_x.domain(d3.range(data.length));

	var svg_bar = d3.select("g."+sensor);
	
	var bars = svg_bar.selectAll("rect.bar")
		.data(data);
		
	bars.enter()
		.append("rect")
		.attr("class", "bar");
	
	var bar_scale = bar_y(sensor);
	
	bars.transition()
	    .duration(300)
	    .ease("quad")
		.attr("width", bar_x.rangeBand())
		.attr("height", function(d) { 
/* 		console.log(sensor+":"+d+"->",bar_height-bar_scale(d)); */
		return bar_height-bar_scale(d); })
		.attr("y", function(d) { return bar_scale(d); })
		.attr("x", function(d,i) { return bar_x(i); });
		
	
}

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
