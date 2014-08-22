// Main is the viz with time series and the bar charts
// Min is the viz with the time line for brushing
var main_margin = {top: 2, right: 35, bottom: 20, left: 25},
    mini_margin = {top: 0, right: 0, bottom: 18, left: 0},
    main_height = 338 - main_margin.top - main_margin.bottom,
    main_width = 570 - main_margin.left - main_margin.right;
    mini_height = 58 - mini_margin.top - mini_margin.bottom,
    mini_width = 570 - mini_margin.left - mini_margin.right;

 
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
    .range([0, mini_width]);

/* main graph scale */
var heartrate_scale = d3.scale.sqrt()
    .range([main_height, 0]),
	airtemp_scale = d3.scale.sqrt()
	.range([250, 50]),
	skintemp_scale = d3.scale.sqrt()
	.range([250, 50]),
	gsr_scale = d3.scale.sqrt()
	.range([main_height, 200]),
	step_scale = d3.scale.sqrt()
	.range([main_height, 200]),
	calorie_scale = d3.scale.sqrt()
	.range([main_height, 300]),
	posture_scale = d3.scale.sqrt()
	.range([300,0]);

/* mini graph scale */
var heartrate_scale_mini = d3.scale.sqrt()
    .range([mini_height-20, 0]),
    airtemp_scale_mini = d3.scale.sqrt()
	.range([mini_height-15, 25]),
	skintemp_scale_mini = d3.scale.sqrt()
	.range([mini_height-15, 25]),
	gsr_scale_mini = d3.scale.sqrt()
	.range([mini_height, 25]);



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
    .orient("bottom")
    .ticks(5),
	mini_xAxis = d3.svg.axis()
    .scale(mini_x)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom")
    .ticks(14),
    mini_xAxis_abbreviated_day = d3.svg.axis()
    .scale(mini_x)
    .tickFormat(d3.time.format("%a"))
    .orient("bottom")
    .ticks(14);

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
    .on("brush", onBrush)
    .on("brushend", on_brush_ended);


/* main_lineX and mini_lineX are linking the lines (or paths) that will be drawn to scaled data.  

Notice that main_x() and main_y0() are functions that scale the data for each dimension. You can define the scales above.  

This is what allows us to have different scales in place for each line, but then draw those lines in the same graph area

    0 - heartrate
    3 - GSR
    5 - skin temp
    6 - air temp
    7 - lumo back posture score
*/
var main_line0 = d3.svg.line()
    .defined(function(d) { return d.heartrate != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return heartrate_scale(d.heartrate); }),
    main_base0 = d3.svg.line()
    .defined(function(d) { return d.heartrate != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return heartrate_scale(d.heartrate); });


var main_line3 = d3.svg.line()
	.interpolate('cardinal')
    .defined(function(d) { return d.gsr != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return gsr_scale(d.gsr); });

var main_line5 = d3.svg.line()
    .defined(function(d) { return d.skin_temp != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return skintemp_scale(d.skin_temp); }),
	main_base5 = d3.svg.line()
    .defined(function(d) { return d.skin_temp != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return skintemp_scale(d.skin_temp); });
 

var main_line6 = d3.svg.line()
    .defined(function(d) { return d.air_temp != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return airtemp_scale(d.air_temp); }),
    main_base6 = d3.svg.line()
    .defined(function(d) { return d.air_temp != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return airtemp_scale(d.air_temp); });
    

var main_line7 = d3.svg.line()
    .defined(function(d) { return d.posture != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return posture_scale(d.posture); }),
    main_base7 = d3.svg.line()
    .defined(function(d) { return d.posture != null; })
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return posture_scale(d.posture); });


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

var svg_mini = d3.select("div#mini").append("svg")
    .attr("width", mini_width + mini_margin.left + mini_margin.right)
    .attr("height", mini_height + mini_margin.top + mini_margin.bottom);

// I still don't understand what clipPath does, but it seems important. It doesn't bother me so, I don't bother it.
svg.append("defs").append("clipPath")
    .attr("id", "clip")
	.append("rect")
    .attr("width", main_width)
    .attr("height", main_height);

// Appending these group elements is needed for drawing the bars vertically.
var main = svg.append("g")
    .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");
    

var brushedRegionGroup = main.append("g")
	.attr("id", "brushedRegion")
	.attr("width", main_width)
	.attr("height", main_height)
	.style("fill","none");


var mini = svg_mini.append("g")
    .attr("transform", "translate(" + mini_margin.left + "," + mini_margin.top + ")");


var activityBarGroup = main.append("g")
	.attr('clip-path', 'url(#clip)');
var activityMainGraph;

// Steps Bars  --  linked to data below
var stepsBarGroup = main.append("g")
    .attr('clip-path', 'url(#clip)');

// Calories Bars  --  linked to data below
var caloriesBarGroup = main.append("g")
    .attr('clip-path', 'url(#clip)');

/* This next line gets the big dataset and opens a new scope
    everything within its scope executes once per line in the dataset
    this is what makes D3 so powerful, but also trips people up, 
        ...because its essentially a FOREACH that doesn't look like a foreach.
    
    
    the ".csv" tells d3 to read the column headers, and allows us to call things directly by name (such as d.steps)

*/

//TODO: move user_id to a global location> this is not the best place to do it
var user_id = document.getElementsByClassName("user_id")[0];
//console.log("user id "+user_id.id);
window.onload = d3.csv($base_url + "/api/main-series.php?user_id="+user_id.id+"&granularity=30", function(error, data) {
    
	// (Shaun)some formatting technique - i don't know
	var heart_rate_base_line = new Array();
	var skin_temp_base_line = new Array();
	var air_temp_base_line = new Array();
	var posture_base_line = new Array();
	
	data.forEach(function(d) {
	    d.Time = parseDate(d.Time);
	    if(isNaN(d.heartrate))
	    {
		    d.heartrate = null;
	    }else
	    {
		    d.heartrate = +d.heartrate;
		    heart_rate_base_line.push({"Time":d.Time,"heartrate":+d.heartrate});
	    }

		// usually skin temp and air temp readings are missing together
	    if(+d.skin_temp == 0)
	    {
		    d.skin_temp = null;
		    d.air_temp = null;
	    }else
	    {
		    d.skin_temp = +d.skin_temp;
		    skin_temp_base_line.push({"Time":d.Time,"skin_temp":+d.skin_temp});
		   
		    d.air_temp = +d.air_temp;
		    air_temp_base_line.push({"Time":d.Time,"air_temp":+d.air_temp});
	    }
	    
	    if(isNaN(d.posture))
	    {
		    d.posture = null;
	    }else
	    {
		    d.posture = +d.posture;
		    posture_base_line.push({"Time":d.Time,"posture":+d.posture});
	    }
	    d.steps = +d.steps;
	    d.calories = +d.calories;
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
	posture_scale.domain([0, 100]);
	
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
		.datum(heart_rate_base_line)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line base0 base")
		.attr("d", main_base0)
		.style("stroke-dasharray", ("3, 3"));
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
		.datum(skin_temp_base_line)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line base5 base")
		.attr("d", main_base5)
		.style("stroke-dasharray", ("3, 3"));;
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line5")
		.attr("d", main_line5);
	
	
	main.append("path")
		.datum(air_temp_base_line)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line base6 base")
		.attr("d", main_base6)
		.style("stroke-dasharray", ("3, 3"));;
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line6")
		.attr("d", main_line6);
	
	
	main.append("path")
		.datum(posture_base_line)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line base7 base")
		.attr("d", main_base7)
		.style("stroke-dasharray", ("3, 3"));;
	main.append("path")
		.datum(data)
		.attr("clip-path", "url(#clip)")
		.attr("class", "line line7")
		.attr("d", main_line7);

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
		.attr("transform", "translate(0," + (mini_height-2) + ")")
		.call(mini_xAxis);
	mini.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (mini_height+4) + ")")
		.call(mini_xAxis_abbreviated_day);		
		
	mini.selectAll("g.tick > text")
		.attr("transform", "translate(0,-4)")
		.attr("font-size","7px");
	mini.selectAll("g.tick > line")
		.attr("transform", "translate(0,-6)")
	
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
		.on("mousemove", mousemove)
		.on("click",zoomViz);

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
	
	console.log("download activity data: "+$base_url + "/api/get_activity.php?user_id="+user_id.id);
	d3.json($base_url + "/api/get_activity.php?user_id="+user_id.id, function(error, activityData)
	{
		/* add bar charts */
	    activityMainGraph = activityBarGroup.selectAll("rect")
	    	.data(activityData)
	    	.enter().append("rect")
	    	.attr("x", function(d, i) { 
	    		var utcSeconds = parseInt(d.time_start);
	    		var t_start = new Date(0);
	    		t_start.setUTCSeconds(utcSeconds);
		    	return main_x(t_start); })
	    	.attr("width", function(d, i) {
	    		var utcStartSeconds = parseInt(d.time_start),
	    			utcEndSeconds = parseInt(d.time_end);
	    			
	    		var t_start = new Date(0),
	    			t_end = new Date(0);
	    		
	    		t_start.setUTCSeconds(utcStartSeconds);
	    		t_end.setUTCSeconds(utcEndSeconds);
	    		
	    		return main_x(t_end) - main_x(t_start); })
	    	.attr("y", function(d) { return 0; })
	    	.attr("height", function(d) { return 315; })
	    	.attr("class", function(d) {return "bar activityBar " + d.act});
	    	
	    	// .attr("width", function(d) { return main_x(d.time_end)-main_x(d.time_start); })
	    	
    	var utcSeconds = parseInt(1405472316);
    	var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    	d.setUTCSeconds(utcSeconds);
    	
    	
    	// hide the bars
    	$(".bar.activityBar").css("visibility", "hidden");	    	
	    	
    	mini.append("g")
    		.attr("class", "x brush")
    		.call(brush)
    		.call(brush.event)
    		.selectAll("rect")
    		.attr("y", -6)
    		.attr("height", mini_height + 7);
	    	
	});
	
	
	
	focusOnLastday(data[data.length - 1].Time)
});


function focusOnLastday(lastDay) {
//	console.log(lastDay);
	var extent = [d3.time.day.offset(lastDay,-1),lastDay];
	
	d3.selectAll(".brush").call(brush.extent(extent));
	onBrush();
	
	addCompareRangeToTopBar();
	addTimeRangeToMap();
}

/* Here we are specifying which lines and barGroups will be zoomed when the brushing is happening

    Of course we want to add them all here
*/

var addComparisonButton = d3.select("button");

addComparisonButton.on("click", addCompareRange);

var startDateEpoc = 0,
	endDateEpoc = 0;


function addCompareRange() {
	addCompareRangeToTopBar();
	diableAddRangeButton();
	addCompareRangeToMainViz();
}


function addCompareRangeToMainViz()
{
/*
	console.log("start px:"+main_x(startDateEpoc*1000));
	console.log("start px:"+main_x(endDateEpoc*1000));
*/
	
	var brushedRegion = svg.select("#brushedRegion");
	
	var start_px = main_x(startDateEpoc*1000);
	var end_px = main_x(endDateEpoc*1000);
	
	brushedRegion.append("rect")
		.attr("class", "brushedRegion")
		.attr("width", (end_px-start_px))
		.attr("height", main_height)
		.attr("x",start_px)
		.style("fill","grey")
		.style("opacity",0.2);
}


function diableAddRangeButton()
{
	d3.selectAll(".brush").call(brush.clear());
	onBrush();
}


function onBrush() {
	// console.log("onBrush");
	// hide activity data
	hideActivityData();

	if (brush.empty())
	{
		// hide button
		addComparisonButton.style("display","none");
    	$(".bar.activityBar").css("visibility", "hidden");
		brushedRegionGroup.style("display",null);
		
		main.selectAll(".line0").style("stroke-width","0.4px");
		main.selectAll(".line3").style("stroke-width","0.4px");
		main.selectAll(".line5").style("stroke-width","0.4px");
		main.selectAll(".line6").style("stroke-width","0.4px");
		main.selectAll(".line7").style("stroke-width","0.4px");
		main.selectAll(".base").style("stroke-width","0.4px");
		stepsMainGraph.attr("width", "3");
		caloriesMainGraph.attr("width", "3");
	}else
	{
		// show button
		addComparisonButton.style("display",null);
		$(".bar.activityBar").css("visibility", "visible");
		main.selectAll("activityBar").style("display", null);
		brushedRegionGroup.style("display","none");

		var dateRange = brush.extent();

//		console.log("brush Range:"+dateRange[0]+","+dateRange[1]);
//		console.log("brush range in pixels:"+main_x(dateRange[0])+","+main_x(dateRange[1]));

		window.startDateEpoc = (((+dateRange[0])/1000)|0);
		window.endDateEpoc = (((+dateRange[1])/1000)|0);
		
		var selectionLength = window.endDateEpoc - window.startDateEpoc;
		//1 day is 86400 secs
		var oneDay = 86400;
		
		var barThicknessScale = 3;//1 represents the thickness of 5 mins which is the highest resolution we can go to.
		var barThickness = barThicknessScale*(main_width*300)/selectionLength | 0;

		barThickness = barThickness>1 ? barThickness: 1;
/*
		console.log("range: "+selectionLength);
		console.log("number of points: "+selectionLength/300)
*/
		stepsMainGraph.attr("width", barThickness);
 		caloriesMainGraph.attr("width", barThickness);

		
		// number of day < 3 -> make line and bar charts thicker
		if (selectionLength < oneDay*3)
		{
			main.selectAll(".line0").style("stroke-width","1.25px");
			main.selectAll(".line3").style("stroke-width","1.25px");
			main.selectAll(".line5").style("stroke-width","1.25px");
			main.selectAll(".line6").style("stroke-width","1.25px");
			main.selectAll(".line7").style("stroke-width","1.25px");
			main.selectAll(".base").style("stroke-width","1.25px");		
		}
		else if (oneDay*3 <= selectionLength && selectionLength < oneDay*6)
		{
		// else make them thinner 
			main.selectAll(".line0").style("stroke-width","0.75px");
			main.selectAll(".line3").style("stroke-width","0.75px");
			main.selectAll(".line5").style("stroke-width","0.75px");
			main.selectAll(".line6").style("stroke-width","0.75px");
			main.selectAll(".line7").style("stroke-width","0.75px");
			main.selectAll(".base").style("stroke-width","0.75px");					
		}else
		{
			main.selectAll(".line0").style("stroke-width","0.4px");
			main.selectAll(".line3").style("stroke-width","0.4px");
			main.selectAll(".line5").style("stroke-width","0.4px");
			main.selectAll(".line6").style("stroke-width","0.4px");
			main.selectAll(".line7").style("stroke-width","0.4px");
			main.selectAll(".base").style("stroke-width","0.4px");
		}
	}
	
	main_x.domain(brush.empty() ? mini_x.domain() : brush.extent());
	
	main.select(".line0").attr("d", main_line0);
	main.select(".base0").attr("d", main_base0);
	main.select(".line3").attr("d", main_line3);
	main.select(".line5").attr("d", main_line5);
	main.select(".base5").attr("d", main_base5);
	main.select(".line6").attr("d", main_line6);
	main.select(".base6").attr("d", main_base6);
	main.select(".line7").attr("d", main_line7);
	main.select(".base7").attr("d", main_base7);
	stepsMainGraph.attr("x", function(d, i) { return main_x(d.Time); });
	caloriesMainGraph.attr("x", function(d, i) { return main_x(d.Time); });
	
	activityMainGraph.attr("x", function(d, i) { 
		var utcSeconds = parseInt(d.time_start);
		var t_start = new Date(0);
		t_start.setUTCSeconds(utcSeconds);
		return main_x(t_start); })
	.attr("width", function(d, i) {
		var utcStartSeconds = parseInt(d.time_start),
			utcEndSeconds = parseInt(d.time_end);
				
		var t_start = new Date(0),
			t_end = new Date(0);
			
		t_start.setUTCSeconds(utcStartSeconds);
		t_end.setUTCSeconds(utcEndSeconds);
			
		return main_x(t_end) - main_x(t_start); });
		
	main.select(".x.axis").call(main_xAxis);
}

function on_brush_ended() {
	console.log("on_brush_ended");
	if (!d3.event.sourceEvent)
	{
		addTimeRangeToMap();
		showActivityData();
		addPathsToMap();
		return;
	}// only transition after input
	var extent0 = brush.extent(),
		extent1 = extent0.map(d3.time.day.round);

	// if empty when rounded, use floor & ceil instead
	if (extent1[0] >= extent1[1]) {
		extent1[0] = d3.time.day.floor(extent0[0]);
//		extent1[1] = d3.time.day.ceil(extent0[1]);
	}
	extent1[1] = d3.time.day.offset(extent1[0],1);
		
	d3.select(this).transition()
		.call(brush.extent(extent1))
		.call(brush.event);
}


function showActivityData() {
}

function hideActivityData() {
}

var shouldZoomIn = true;

function zoomViz() {
//	console.log("click");
    var p = d3.mouse( this);
	var mouse_x = p[0];
	var time_range_mid_point = main_x.invert(mouse_x);
	if (shouldZoomIn){
		// main_x goes from 0 to main_width
		var range = main_x.range();
		var relative_position = mouse_x/range[1];
		console.log(range);
		var extent = [d3.time.hour.offset(time_range_mid_point,-6*relative_position), 
					  d3.time.hour.offset(time_range_mid_point,+6*(1-relative_position))];
		shouldZoomIn = false;
	}else {
		var startDay = d3.time.day(time_range_mid_point);
		var extent = [startDay, d3.time.day.offset(startDay,+1)];
		shouldZoomIn = true;
	}
	
	
	main_x.domain(extent);
	
	main.transition().select(".line0").attr("d", main_line0);
	main.transition().select(".base0").attr("d", main_base0);
	main.transition().select(".line3").attr("d", main_line3);
	main.transition().select(".line5").attr("d", main_line5);
	main.transition().select(".base5").attr("d", main_base5);
	main.transition().select(".line6").attr("d", main_line6);
	main.transition().select(".base6").attr("d", main_base6);
	main.transition().select(".line7").attr("d", main_line7);
	main.transition().select(".base7").attr("d", main_base7);
	stepsMainGraph.transition().attr("x", function(d, i) { return main_x(d.Time); });
	caloriesMainGraph.transition().attr("x", function(d, i) { return main_x(d.Time); });
	
	activityMainGraph.transition().attr("x", function(d, i) { 
		var utcSeconds = parseInt(d.time_start);
		var t_start = new Date(0);
		t_start.setUTCSeconds(utcSeconds);
		return main_x(t_start); })
	.attr("width", function(d, i) {
		var utcStartSeconds = parseInt(d.time_start),
			utcEndSeconds = parseInt(d.time_end);
				
		var t_start = new Date(0),
			t_end = new Date(0);
			
		t_start.setUTCSeconds(utcStartSeconds);
		t_end.setUTCSeconds(utcEndSeconds);
			
		return main_x(t_end) - main_x(t_start); });
		
	main.select(".x.axis").call(main_xAxis);
}