// http://fiddle.jshell.net/CjaD3/1/
// http://jsfiddle.net/JGytk/ 


var main_margin = {top: 20, right: 80, bottom: 100, left: 40},
    mini_margin = {top: 430, right: 80, bottom: 20, left: 40},
    main_width = 700 - main_margin.left - main_margin.right,
    main_height = 500 - main_margin.top - main_margin.bottom,
    mini_height = 500 - mini_margin.top - mini_margin.bottom;

var formatDate = d3.time.format("%Y-%m-%d %H:%M:%S"),
    parseDate = formatDate.parse,
    bisectDate = d3.bisector(function(d) { return d.Time; }).left,
    formatOutput0 = function(d) { return formatDate(d.Time) + " - " + d.heartrate; },
    formatOutput1 = function(d) { return formatDate(d.Time) + " - " + d.steps; },
    formatOutput2 = function(d) { return formatDate(d.Time) + " - " + d.calories; };

var main_x = d3.time.scale()
    .range([0, main_width]),
    mini_x = d3.time.scale()
    .range([0, main_width]);

var main_y0 = d3.scale.sqrt()
    .range([main_height, 0]),
    main_y1 = d3.scale.sqrt()
    .range([main_height, 0]),
    main_y2 = d3.scale.sqrt()
    .range([0, main_height]),
    mini_y0 = d3.scale.sqrt()
    .range([mini_height, 0]),
    mini_y1 = d3.scale.sqrt()
    .range([mini_height, 0]);

var main_xAxis = d3.svg.axis()
    .scale(main_x)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom"),
    mini_xAxis = d3.svg.axis()
    .scale(mini_x)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom");

var main_yAxisLeft = d3.svg.axis()
    .scale(main_y0)
    .orient("left");
    main_yAxisRight = d3.svg.axis()
.scale(main_y1)
    .orient("right");

var brush = d3.svg.brush()
    .x(mini_x)
    .on("brush", brush);

var main_line0 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return main_y0(d.heartrate); });

var main_line3 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return main_y1(d.gsr); });

var main_line5 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return main_y0(d.skin_temp); });

var main_line6 = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return main_x(d.Time); })
    .y(function(d) { return main_y0(d.air_temp); });

var mini_line0 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return mini_y0(d.heartrate); });

var mini_line3 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return mini_y1(d.gsr); });

var mini_line5 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return mini_y1(d.skin_temp); });

var mini_line6 = d3.svg.line()
    .x(function(d) { return mini_x(d.Time); })
    .y(function(d) { return mini_y1(d.air_temp); });

var svg = d3.select("div#main").append("svg")
    .attr("width", main_width + main_margin.left + main_margin.right)
    .attr("height", main_height + main_margin.top + main_margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", main_width)
    .attr("height", main_height);

var main = svg.append("g")
    .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");

var mini = svg.append("g")
    .attr("transform", "translate(" + mini_margin.left + "," + mini_margin.top + ")");

var barsGroup1 = main.append("g")
    .attr('clip-path', 'url(#clip)');

var barsGroup2 = main.append("g")
    .attr('clip-path', 'url(#clip)');


d3.csv($base_url + "/api/main-series.php?user_id=1&granularity=30", function(error, data) {
//console.log(data);
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

  main_x.domain([data[0].Time, data[data.length - 1].Time]);
  main_y0.domain(d3.extent(data, function(d) { return d.heartrate; }));
  main_y1.domain(d3.extent(data, function(d) { return d.calories; }));
  main_y2.domain([0, d3.max(data, function(d) { return d.steps*3; })]);

  mini_x.domain(main_x.domain());
  mini_y0.domain(main_y0.domain());
  mini_y1.domain(main_y1.domain());

  main.append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "line line0")
      .attr("d", main_line0);

/*
  main.append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "line line1")
      .attr("d", main_line1);
*/

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

  mainGraph2 = barsGroup2.selectAll("rect")
	.data(data)
       .enter().append("rect")
	.attr("x", function(d, i) { return main_x(d.Time); })
	.attr("y", function(d) { return main_height - main_y2(d.calories) - main_y2(d.steps); })
	.attr("width", 1)
	.attr("height", function(d) { return main_y2(d.calories); })
        .attr("class", "bar bar2");
  mainGraph1 = barsGroup1.selectAll("rect")
	.data(data)
       .enter().append("rect")
	.attr("x", function(d, i) { return main_x(d.Time); })
	.attr("y", function(d) { return main_height - main_y2(d.steps); })
	.attr("width", 1)
	.attr("height", function(d) { return main_y2(d.steps); })
        .attr("class", "bar bar1");



/*
  var barWidth = main_width / data.length;
  var bar = svg.selectAll("g")
      .data(data)
     .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return main_y0(d.steps) + 20; })
      .attr("height", function(d) { return main_height - main_y0(d.steps); })
      .attr("width", 3)
      .attr("class", "bar1");

  bar.append("rect")
      .attr("y", function(d) { return mini_y0(d.steps) + mini_height; })
      .attr("transform", "translate(0," + main_height +")")
      .attr("height", function(d) { return mini_height - mini_y0(d.steps); })
      .attr("width", 3);
*/


  main.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + main_height + ")")
      .call(main_xAxis);

  main.append("g")
      .attr("class", "y axis axisLeft")
      .call(main_yAxisLeft)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Heartrate & Steps");

  main.append("g")
      .attr("class", "y axis axisRight")
      .attr("transform", "translate(" + main_width + ", 0)")
      .call(main_yAxisRight)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Calories");

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

  // stepseige auf der Zeitleiste
  focus.append("line")
      .attr("class", "x")
      .attr("y1", main_y0(0) - 6)
      .attr("y2", main_y0(0) + 6)

  // stepseige auf der linken Leiste
  focus.append("line")
      .attr("class", "y0")
      .attr("x1", main_width - 6) // nach links
      .attr("x2", main_width + 6); // nach rechts

  // stepseige auf der rechten Leiste
  focus.append("line")
      .attr("class", "y1")
      .attr("x1", main_width - 6)
      .attr("x2", main_width + 6);

  focus.append("circle")
      .attr("class", "y0")
      .attr("r", 4);

  focus.append("text")
      .attr("class", "y0")
      .attr("dy", "-1em");

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

    focus.select("circle.y0").attr("transform", "translate(" + main_x(d.Time) + "," + main_y0(d.heartrate) + ")");
    focus.select("text.y0").attr("transform", "translate(" + main_x(d.Time) + "," + main_y0(d.heartrate) + ")").text(formatOutput0(d));
    focus.select("circle.y1").attr("transform", "translate(" + main_x(d.Time) + "," + main_y1(d.steps) + ")");
    focus.select("text.y1").attr("transform", "translate(" + main_x(d.Time) + "," + main_y1(d.steps) + ")").text(formatOutput1(d));
    focus.select(".x").attr("transform", "translate(" + main_x(d.Time) + ",0)");
    focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.heartrate) + ")").attr("x2", main_width + main_x(d.Time));
    focus.select(".y1").attr("transform", "translate(0, " + main_y1(d.steps) + ")").attr("x1", main_x(d.Time));
  }
});

function brush() {
  main_x.domain(brush.empty() ? mini_x.domain() : brush.extent());
  main.select(".line0").attr("d", main_line0);
  main.select(".line3").attr("d", main_line3);
  main.select(".line5").attr("d", main_line5);
  main.select(".line6").attr("d", main_line6);

  mainGraph1.attr("x", function(d, i) { return main_x(d.Time); });
  mainGraph2.attr("x", function(d, i) { return main_x(d.Time); });
    //mainGraph.attr("width", 1);

  main.select(".x.axis").call(main_xAxis);
}