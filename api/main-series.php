<?php
$username = "shaun"; 
$password = "ischool";   
$host = "localhost";
$database="shaun";
    
$server = mysql_connect($host, $username, $password);
$connection = mysql_select_db($database, $server);


$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);

if (!$param['user_id']) {
  $param['user_id'] = 1;
  //exit();
}

if (!$param['granularity']) {
  // setting default to 5 minutes
  $gran = 5*60;
} else {
  $gran = $param['granularity']*60;
}

// built in a limit for begin_time using epoch - since I have more that two weeks data in there

$myquery = "SELECT * FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'] . " AND heartrate != 'None' AND steps != 'None' AND date_epoch > 1402012800 AND mod(date_epoch,".$gran.")=0 ORDER BY date_epoch ASC";
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
    }
    if (isset($c_data[$y])) {
      $calories += $c_data[$y]['calories'];
    }
    if (isset($c_data[$y])) {
      $hr += $c_data[$y]['heartrate'];
      $c_hr++;
    }
  }

  echo $d['date_human'] . "," . $hr/$c_hr . "," . $steps . "," . $calories . "," . $d['gsr'] . "," . $d['skin_temp'] . "," . $d['air_temp'] . "\n";
}
     
mysql_close($server);
?>