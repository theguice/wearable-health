/* Top bars are actually generating a separate svg canvas for each parameter. 
 
 I find that a 100px width works well for spacing them evenly across the page; feel free to modify that of course
 
 
 See comments below about the compare tool
*/
top_bars("heartrate");
top_bars("steps");
top_bars("calories");
top_bars("gsr");
top_bars("skin_temp");
top_bars("air_temp");

function top_bars(param) {

    var margin = {top: 0, right: 0, bottom: 30, left: 0},
        width = 100 - margin.left - margin.right,
        height = 120 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([30, width], .1);

    var y = d3.scale.linear()
        .range([height-5, 10]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(1);

    var svg = d3.select("div."+param).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    d3.json($base_url + "/api/parameter_averages.php?"+param+"=1", function(error, data) {
        x.domain(data.map(function(d) { return d.name; }));
        y.domain([data.map(function(d) { return d.min; }), data.map(function(d) { return d.max; }) ]);

        svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(30,20)")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");

        svg.selectAll("foreignObject")
              .data(data)
                .enter()
              .append("foreignObject")
                .attr('x', '30')
                .attr('y', '0')
                .html(function(d,i) { return "<label class='checkbox'><input type='checkbox' id='option_" + d.name + "' ></input>" + d.name + "</label>"; });

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.name); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value) + 15; });
    });
}
