// Main is the viz with time series and the bar charts
// Min is the viz with the time line for brushing
var main_margin = {top: 20, right: 80, bottom: 100, left: 40},
    mini_margin = {top: 430, right: 80, bottom: 20, left: 40},
    main_width = 700 - main_margin.left - main_margin.right,
    main_height = 500 - main_margin.top - main_margin.bottom,
    mini_height = 500 - mini_margin.top - mini_margin.bottom;

 
// D3 has powerful date formatting engine. 
// Allows you to make little helper functions to use throughout the code. For example here we can call formatDate anywhere we read the time from our data

var formatDate = d3.time.format("%Y-%m-%d %H:%M:%S"), 
    formatDateShort = d3.time.format("%H:%M"),
    parseDate = formatDate.parse,
    bisectDate = d3.bisector(function(d) { return d.Time; }).left,
    formatOutputHeartRate = function(d) { return formatDateShort(d.Time) + "  " + d.heartrate + "bmp"; },
    formatOutputSteps = function(d) { return formatDateShort(d.Time) + "  " + d.steps + "steps"; },
    formatOutputCalories = function(d) { return formatDateShort(d.Time) + "  " + d.calories; };

// telling scales to take up the full width and height available
/* time axis scales */
var main_x = d3.time.scale()
    .range([0, main_width]),
    mini_x = d3.time.scale()
    .range([0, main_width]);

/* main graph scale */
var heartrate_scale = d3.scale.sqrt()
    .range([main_height, 0]),
	airtemp_scale = d3.scale.sqrt()
	.range([250, 50]),
	skintemp_scale = d3.scale.sqrt()
	.range([250, 50]),
	gsr_scale = d3.scale.sqrt()
	.range([main_height, 300]),
	step_scale = d3.scale.sqrt()
	.range([main_height, 200]),
	calorie_scale = d3.scale.sqrt()
	.range([main_height, 300]);

/* mini graph scale */
var heartrate_scale_mini = d3.scale.sqrt()
    .range([mini_height-20, 0]),
    airtemp_scale_mini = d3.scale.sqrt()
	.range([mini_height-15, 25]),
	skintemp_scale_mini = d3.scale.sqrt()
	.range([mini_height-15, 25]),
	gsr_scale_mini = d3.scale.sqrt()
	.range([mini_height, 40]);



/*
var main_y0 = d3.scale.sqrt()
    .range([main_height, 0]),
    main_y1 = d3.scale.sqrt()
    .range([main_height, 0]),
*/
/*
    main_y2 = d3.scale.sqrt()
    .range([0, main_height]);
*/
    
/*
var mini_y0 = d3.scale.sqrt()
    .range([mini_height, 0]),
    mini_y1 = d3.scale.sqrt()
    .range([mini_height, 0]);
*/

// Axis formatting and positioning
var main_xAxis = d3.svg.axis()
    .scale(main_x)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom"),
	mini_xAxis = d3.svg.axis()
    .scale(mini_x)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom");

var main_yAxisLeft = d3.svg.axis()
    .scale(heartrate_scale)
    .orient("left");
var main_yAxisRight = d3.svg.axis()
	.scale(step_scale)
    .orient("right")
    .tickValues([0, 400, 900, 1600, 2500, 3600, 4900]);

// The BRUSH is activated when we click-and-drag on the mini graph, located below the main graph
var brush = d3.svg.brush()
    .x(mini_x)
    .on("brush", brush);


/* main_lineX and mini_lineX are linking the lines (or paths) that will be drawn to scaled data.  

Notice that main_x() and main_y0() are functions that scale the data for each dimension. You can define the scales above.  

This is what allows us to have different scales in place for each line, but then draw those lines in the same graph area

    0 - heartrate
    3 - GSR
    5 - skin temp
    6 - air temp
*/
var main_line0 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return heartrate_scale(d.heartrate); });

var main_line3 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return gsr_scale(d.gsr); });

var main_line5 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return skintemp_scale(d.skin_temp); });

var main_line6 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return airtemp_scale(d.air_temp); });

var mini_line0 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return heartrate_scale_mini(d.heartrate); });

var mini_line3 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return gsr_scale_mini(d.gsr); });

var mini_line5 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return skintemp_scale_mini(d.skin_temp); });

var mini_line6 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return airtemp_scale_mini(d.air_temp); });

// sets up the svg canvas where we will draw cool stuff
var svg = d3.select("div#main").append("svg")
    .attr("width", main_width + main_margin.left + main_margin.right)
    .attr("height", main_height + main_margin.top + main_margin.bottom);

// I still don't understand what clipPath does, but it seems important. It doesn't bother me so, I don't bother it.
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", main_width)
    .attr("height", main_height);

// Appending these group elements is needed for drawing the bars vertically.
var main = svg.append("g")
    .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");

var mini = svg.append("g")
    .attr("transform", "translate(" + mini_margin.left + "," + mini_margin.top + ")");

// Calories Bars  --  linked to data below
var caloriesBarGroup = main.append("g")
    .attr('clip-path', 'url(#clip)');

// Steps Bars  --  linked to data below
var stepsBarGroup = main.append("g")
    .attr('clip-path', 'url(#clip)');


/* This next line gets the big dataset and opens a new scope
    everything within its scope executes once per line in the dataset
    this is what makes D3 so powerful, but also trips people up, 
        ...because its essentially a FOREACH that doesn't look like a foreach.
    
    
    the ".csv" tells d3 to read the column headers, and allows us to call things directly by name (such as d.steps)

*/
d3.csv($base_url + "/api/main-series.php?user_id=1&granularity=30", function(error, data) {
    
	// some formatting technique - i don't know
	data.forEach(function(d) {
	    d.Time = parseDate(d.Time);
	    d.heartrate = +d.heartrate;
	    d.steps = +d.steps;
	    d.calories = +d.calories;
	    d.skin_temp = +d.skin_temp;
	    d.air_temp = +d.air_temp;
	});

	data.sort(function(a, b) {
		return a.Time - b.Time;
	});

    
	/* domain is different from scale, but it has something to do with fitting all of the data within a specified range that is dynamic based ot the max or "extent" of each particular parameter
	
	I think you'll want to have params in different domains for the y-dimension.
	Some of them can use the same domain
	    heartrate, air_temp and skin_temp for example are all fairly similar
	But others may differ wildly and should be in separate domains
	
	*/
	main_x.domain([data[0].Time, data[data.length - 1].Time]);
	
	heartrate_scale.domain(d3.extent(data, function(d) { return d.heartrate; }));
	skintemp_scale.domain(d3.extent(data, function(d) { return d.skin_temp; }));
	airtemp_scale.domain(d3.extent(data, function(d) { return d.air_temp; }));
	gsr_scale.domain(d3.extent(data, function(d) { return d.gsr; }));
	calorie_scale.domain(d3.extent(data, function(d) { return d.calories; }));
	step_scale.domain([0, d3.max(data, function(d) { return d.steps; })]);
	
	// mini just reuses whatever works for the main
	mini_x.domain(main_x.domain());
	heartrate_scale_mini.domain(heartrate_scale.domain());
	skintemp_scale_mini.domain(skintemp_scale.domain());
	airtemp_scale_mini.domain(airtemp_scale.domain());
	gsr_scale_mini.domain(gsr_scale.domain());
/*
	mini_y0.domain(heartrate_scale.domain());
	mini_y1.domain(main_y1.domain());
*/
	
	
	// append means "append element to svg canvas"
	// path is drawing the line according to the data (which we linked up earlier to these main_lineX variables
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line0")
		.attr("d", main_line0);
	
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line3")
		.attr("d", main_line3);
	
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line5")
		.attr("d", main_line5);
	
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line6")
		.attr("d", main_line6);
	
	
	/* Here we are drawing the bars, which works differently from drawing lines
	for bars you need to give 
	a starting point (x,y)
	a width and height of the bar
	
	Important note: the (0,0) coordinate for SVG is in the top left.
	Notice that the starting (x,y) point is actually the top of the bar.
	From there it is drawn down for a length of "height"
	
	Lastly we associate a class to these elements "bar" and "bar2", which are referenced by our main.css file
	
	*/
	caloriesMainGraph = caloriesBarGroup.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr("x", function(d, i) { return main_x(d.Time); })
		.attr("y", function(d) { return calorie_scale(d.calories); })
		.attr("width", 1)
		.attr("height", function(d) { return calorie_scale(d.calories); })
		.attr("class", "bar bar2");
	
	stepsMainGraph = stepsBarGroup.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr("x", function(d, i) { return main_x(d.Time); })
		.attr("y", function(d) { return step_scale(d.steps); })
		.attr("width", 1)
		.attr("height", function(d) { return step_scale(d.steps); })
		.attr("class", "bar bar1");
	
	main.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + main_height + ")")
		.call(main_xAxis);
	
	// Positioning axis labels  --   THESE NEED TO BE CHANGED OR REMOVED
	main.append("g")
		.attr("class", "y axis axisLeft")
		.call(main_yAxisLeft)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Heartrate");

	// Right Axis line #glue
	main.append("line")
		.attr("class", "axis")
		.attr("y1", 0)
		.attr("y2", main_height)
		.attr("x1", main_width)
		.attr("x2", main_width);

	main.append("g")
		.attr("class", "y axis axisRight")
		.attr("transform", "translate(" + main_width + ", 0)")
		.call(main_yAxisRight)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -12)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Steps");
	
	/*  And then we draw the mini lines
	
	Notice that these lines get different classes than the ones in main
	This is how we style them differently using the css
	*/
	mini.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + mini_height + ")")
		.call(main_xAxis);
	
	mini.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", mini_line0);
	
	mini.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", mini_line3);
	
	mini.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", mini_line5);
	
	mini.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", mini_line6);
	
	
	mini.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", mini_height + 7);
	
	var focus = main.append("g")
		.attr("class", "focus")
		.style("display", "none");
	
	
	/*  The focus is what draws the mouseover lines, cirles and labels on the main data lines 
	
	It is linked to data below, in the mousemove function. It is there that you will format the dates
	
	y0 - heart rate
	y1 - steps
	*/

	focus.append("line")
		.attr("class", "x")
		.attr("y1", 0)
		.attr("y2", main_height);
	
	focus.append("line")
		.attr("class", "y0")
		.attr("x1", main_width - 6)
		.attr("x2", main_width + 6);
	focus.append("circle")
		.attr("class", "y0")
		.attr("r", 4);
	focus.append("text")
		.attr("class", "y0")
		.attr("dy", "-1em");
	
	
	focus.append("line")
		.attr("class", "y1")
		.attr("x1", main_width - 6)
		.attr("x2", main_width + 6);
	focus.append("circle")
		.attr("class", "y1")
		.attr("r", 4);
	focus.append("text")
		.attr("class", "y1")
		.attr("dy", "-1em");
	
	
	main.append("rect")
		.attr("class", "overlay")
		.attr("width", main_width)
		.attr("height", main_height)
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

	function mousemove() {
	
		var x0 = main_x.invert(d3.mouse(this)[0]),
		i = bisectDate(data, x0, 1),
		d0 = data[i - 1],
		d1 = data[i],
		t = d0.Time,
		d = x0 - d0.Time > d1.Time - x0 ? d1 : d0;
		
		mapHighlightPoint(t);
		
		focus.select("circle.y0").attr("transform", "translate(" + main_x(d.Time) + "," + heartrate_scale(d.heartrate) + ")");
		focus.select("text.y0").attr("transform", "translate(" + main_x(d.Time) + "," + heartrate_scale(d.heartrate) + ")").text(formatOutputHeartRate(d));
		focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + heartrate_scale(d.heartrate) + ")").attr("x2", main_width + main_x(d.Time));
		
		focus.select("circle.y1").attr("transform", "translate(" + main_x(d.Time) + "," + step_scale(d.steps) + ")");
		focus.select("text.y1").attr("transform", "translate(" + main_x(d.Time) + "," + step_scale(d.steps) + ")").text(formatOutputSteps(d));
		focus.select(".y1").attr("transform", "translate(0, " + step_scale(d.steps) + ")").attr("x1", main_x(d.Time));
		
		focus.select(".x").attr("transform", "translate(" + main_x(d.Time) + ",0)");
	}
});


/* Here we are specifying which lines and barGroups will be zoomed when the brushing is happening

    Of course we want to add them all here
*/

var addComparisonButton = d3.select("button");

addComparisonButton.on("click", addCompareRangeToTopBar);

var startDateEpoc = 0,
	endDateEpoc = 0;

function addCompareRangeToTopBar() {
	console.log('addCompareRangeToTopBar');
	var param = "heartrate";
	var url = $base_url + "/api/parameter_averages.php?"+param+"=1&start_time="+startDateEpoc+"&end_time="+endDateEpoc;
	console.log(url);
	d3.json($base_url + "/api/parameter_averages.php?"+param+"=1&start_time="+startDateEpoc+"&end_time="+endDateEpoc, function(error, data)
	{
		console.log(data);
	});

}



function brush() {

	if (brush.empty())
	{
		// hide button
		addComparisonButton.style("display","none");
	}else
	{
		// show button
		addComparisonButton.style("display",null);
		var dateRange = brush.extent();
		window.startDateEpoc = (((+dateRange[0])/1000)|0);
		window.endDateEpoc = (((+dateRange[1])/1000)|0);
		console.log(+dateRange[0]);
	}
	
	main_x.domain(brush.empty() ? mini_x.domain() : brush.extent());
	
	main.select(".line0").attr("d", main_line0);
	main.select(".line3").attr("d", main_line3);
	main.select(".line5").attr("d", main_line5);
	main.select(".line6").attr("d", main_line6);
	
	stepsMainGraph.attr("x", function(d, i) { return main_x(d.Time); });
	caloriesMainGraph.attr("x", function(d, i) { return main_x(d.Time); });
	// you can change the width of bars when zoomed in!
	// mainGraph.attr("width", 1);
	
	main.select(".x.axis").call(main_xAxis);
}

