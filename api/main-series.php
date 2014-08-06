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



/* -------------------------------- */
/*   All the data to be averaged    */
/* -------------------------------- */
$all_basis_query_url = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND steps != 'None' AND date_epoch > 1402012800 ORDER BY date_epoch ASC";
$all_basis_query = mysql_query($all_basis_query_url);
$all_basis_data = array();
for ($x = 0; $x < mysql_num_rows($all_basis_query); $x++) {
  $d = mysql_fetch_assoc($all_basis_query);
  $all_basis_data[$d['date_epoch']] = $d;
}
/* Lumo Back data */
// Good sitting posture being selected right now. May not be the best choice, EDA could be one way to solve the problem
$lumo_back_query_url = "SELECT * FROM `wh_d_lumo` WHERE `u_id`=" . $param['user_id'] . " AND act = 'SG' AND date_epoch > 1402012800 AND mod(date_epoch,".$gran.")=0 ORDER BY date_epoch ASC";
$lumo_back_query = mysql_query($lumo_back_query_url);
$lumo_back_data = array();
for ($x = 0; $x < mysql_num_rows($lumo_back_query); $x++) {
  $d = mysql_fetch_assoc($lumo_back_query);
  $lumo_back_data[$d['date_epoch']] = $d;
}

/* --------------------------------  */
/* Data at the granularity requested */
/* --------------------------------  */
$myquery = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND steps != 'None' AND date_epoch > 1402012800 AND mod(date_epoch,".$gran.")=0 ORDER BY date_epoch ASC";
$query = mysql_query($myquery);


if ( ! $query ) {
  echo mysql_error();
  die;
}


// Here we are looping through the query response and building the CSV reply.
echo "epoc,Time,heartrate,steps,calories,gsr,skin_temp,air_temp,posture\n";
$data = array();
for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $d = mysql_fetch_assoc($query);

  $steps = 0;
  $calories = 0;
  $hr = 0; // heart rate
  $c_hr = 0;// heart rate count
  $c = 0;//count
  $posture = 0;
  $posture_count = 0;
  // count the steps and calories from next GRANULARITY minutes
  for ($y = $d['date_epoch']; $y < ($d['date_epoch'] + $gran); $y++) {
    $c++;
    if (isset($all_basis_data[$y])) {
      $steps += $all_basis_data[$y]['steps'];
      $calories += $all_basis_data[$y]['calories'];
      if ($all_basis_data[$y]['heartrate'] != "None")
      {
		  $hr += $all_basis_data[$y]['heartrate'];
	      $c_hr++;
      }
    }
    if (isset($lumo_back_data[$y])) {
	    $posture += $lumo_back_data[$y]['pct'];
	    $posture_count++;
    }
  }
/*   echo $c_hr; */
  $heart_rate = "null";
  if ($c_hr>0)
  {
  	$heart_rate = floor($hr/$c_hr);
  }
  $posture_aggregate = "null";
  if ($posture_count>0)
  {
	  $posture_aggregate = floor($posture/$posture_count);
  }
/*   echo $heart_rate."\n"; */
  // This is the actual data output.  echo == print essentially
  // floor() rounds the value down to nearest whole number
  echo $d['date_epoch'] . "," .$d['date_human'] . "," . $heart_rate . "," . floor($steps) . "," . floor($calories) . "," . floor($d['gsr']) . "," . floor($d['skin_temp']) . "," . floor($d['air_temp']) . "," .$posture_aggregate . "\n";
}
     
mysql_close($server);
?>