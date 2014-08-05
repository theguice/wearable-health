<?php

  // First we execute our common code to connection to the database and start the session 
require("../common.php"); 

$server = mysql_connect($host, $username, $password);
$connection = mysql_select_db($dbname, $server);

$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);



/*  A NOTE ABOUT DEBUGGING PHP SCRIPTS:

do it on the command line.  
    passing params is different on the command line (doesn't work via a url fashion)

Running it via the browser will give "internal server errors", but not reference specific line numbers of where the issue is occurring.

*/



// If we are not passed a user_id on the URL, then we cannot continue
if (!$param['user_id']) {
  exit();
}

// Granularity is passed in minutes. We convert that to seconds because times are stored as EPOCH in the db.
if (!$param['granularity']) {
  // setting default to 5 minutes
  $gran = 5*60;
} else {
  $gran = $param['granularity']*60;
}

// I built in a limit for begin_time using epoch - since I have more that two weeks data in there and I want to ignore the earlier stuff.  I guess I could just have deleted that data manually.  This detail won't affect any other user's queries because they'll occur later in time.

/* $myquery = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND heartrate != 'None' AND steps != 'None' AND date_epoch > 1402012800 AND mod(date_epoch,".$gran.")=0 ORDER BY date_epoch ASC"; */
$myquery = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND steps != 'None' AND date_epoch > 1402012800 AND mod(date_epoch,".$gran.")=0 ORDER BY date_epoch ASC";
$query = mysql_query($myquery);

$myquery = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND steps != 'None' AND date_epoch > 1402012800 ORDER BY date_epoch ASC";
$c_query = mysql_query($myquery);
$c_data = array();
for ($x = 0; $x < mysql_num_rows($c_query); $x++) {
  $d = mysql_fetch_assoc($c_query);
  $c_data[$d['date_epoch']] = $d;
}

if ( ! $query ) {
  echo mysql_error();
  die;
}


// Here we are looping through the query response and building the CSV reply.
echo "Time,heartrate,steps,calories,gsr,skin_temp,air_temp\n";
$data = array();
for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $d = mysql_fetch_assoc($query);

  $steps = 0;
  $calories = 0;
  $hr = 0;
  $c_hr = 0;
  $c = 0;
  // count the steps and calories from next GRANULARITY minutes
  for ($y = $d['date_epoch']; $y < ($d['date_epoch'] + $gran); $y++) {
    $c++;
    if (isset($c_data[$y])) {
      $steps += $c_data[$y]['steps'];
      $calories += $c_data[$y]['calories'];
      if ($c_data[$y]['heartrate'] != "None")
      {
		  $hr += $c_data[$y]['heartrate'];
	      $c_hr++;
      }
    }
  }
/*   echo $c_hr; */
  $heart_rate = "null";
  if ($c_hr>0)
  {
  	$heart_rate = floor($hr/$c_hr);
  }
/*   echo $heart_rate."\n"; */
  // This is the actual data output.  echo == print essentially
  // floor() rounds the value down to nearest whole number
  echo $d['date_human'] . "," . $heart_rate . "," . floor($steps) . "," . floor($calories) . "," . floor($d['gsr']) . "," . floor($d['skin_temp']) . "," . floor($d['air_temp']) . "\n";
}
     
mysql_close($server);
?>