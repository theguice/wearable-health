<?php

  // First we execute our common code to connection to the database and start the session 
require("../common.php"); 

$server = mysql_connect($host, $username, $password);
$connection = mysql_select_db($dbname, $server);

$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);

/*  welcome to php

$param is an associative array (same as a dictionary in python).  It holds the parameters that come in via the URL.

To implement the compare tool, you'll need to accept multiple date ranges as params, and so you should add some checks to see what you have:

$time_ranges = array();  // initialize array of time ranges
if ($param['s_time1']  && $param['e_time1']) {
   // push this start/end time pair to a $time_ranges
   $time_ranges[] = array($param['s_time1'], $param['e_time1']);
   
if ($param['s_time2']  && $param['e_time2']) {
    // same as s_time1
   
if ($param['s_time3']  && $param['e_time3']) {
    // same as s_time1

do as many as you'd like to support in the compare tool


//now, for each time range, do a mysql query
for $r in $time_ranges:
    SELECT .... FROM wh_d_basis WHERE ... AND time_epoch > $r[0] and time_epoch < $r[1]
    // note that $r[0] and $r[1] are now the start/end times we pushed on earlier
    
    // push mysql response into a main data array
    
    
// outside of the for loop now you can collect the data, add the appropriate min/max keys (see below)



I hope this psuedocode makes at least some sense.


*/

/*

Expected Parameters
start_time: epoc
end_time: epoc

heartrate: 1
steps
calories
gsr
skin_temp
air_temp

days: weekdays or weekends
*/






if ($param['heartrate'] == 1) {
  $myquery = "SELECT  AVG(heartrate) as heartrate FROM  `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'";
} else if ($param['steps'] == 1) {
  $myquery = "SELECT  AVG(steps) as steps  FROM  `wh_d_basis` WHERE `u_id`=1 AND steps != 'None'";
} else if ($param['calories'] == 1) {
  $myquery = "SELECT  AVG(calories) as calories  FROM  `wh_d_basis` WHERE `u_id`=1 AND calories != 'None'";
} else if ($param['gsr'] == 1) {
  $myquery = "SELECT  AVG(gsr) as gsr  FROM  `wh_d_basis` WHERE `u_id`=1 AND gsr != 'None'";
} else if ($param['skin_temp'] == 1) {
  $myquery = "SELECT  AVG(skin_temp) as skin_temp  FROM  `wh_d_basis` WHERE `u_id`=1 AND skin_temp != 'None'";
} else if ($param['air_temp'] == 1) {
  $myquery = "SELECT  AVG(air_temp) as air_temp  FROM  `wh_d_basis` WHERE `u_id`=1 AND air_temp != 'None'";
} else {
  // quit
  exit();
}

if ($param['start_time']  && $param['end_time'])
{
	$myquery .= sprintf(" AND date_epoch > %u AND date_epoch < %u", $param['start_time'], $param['end_time']);
}

// day modifier
if ($param['days'] == 'weekdays') {
  $myquery .= " AND dayofweek(date_human) IN (2,3,4,5,6)";
} else if ($param['days'] == 'weekends') {
  $myquery .= " AND dayofweek(date_human) IN (1,7)";
}


//$myquery = "SELECT  AVG(heartrate) as heartrate, AVG(steps) as steps  FROM  `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0' AND steps != 'None'";
$query = mysql_query($myquery);

if ( ! $query ) {
  echo mysql_error();
  die;
}
    
$data = array();
$d = array();

for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $data[] = mysql_fetch_assoc($query);
}

// Here I have hard coded min and max values for each parameter. These values will be read by d3 and used as the min/max on the y-axis of the bar charts.
while ($k = current($data[0])) {
  if (key($data[0]) == 'heartrate') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 200 );
    next($data[0]);
  } elseif (key($data[0]) == 'steps') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 100 );
    next($data[0]);
  } elseif (key($data[0]) == 'calories') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 20 );
    next($data[0]);
  } elseif (key($data[0]) == 'posture') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 100 );
    next($data[0]);
  } elseif (key($data[0]) == 'gsr') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 2 );
    next($data[0]);
  } elseif (key($data[0]) == 'air_temp') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 200 );
    next($data[0]);
  } elseif (key($data[0]) == 'skin_temp') {
    $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])], 'min' => 0, 'max' => 200 );
    next($data[0]);
  }
}

// Sends back the array in a nice json format
echo json_encode($d);
     
mysql_close($server);
?>