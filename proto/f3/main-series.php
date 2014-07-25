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
  exit();
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

if ( ! $query ) {
  echo mysql_error();
  die;
}

echo "Time,heartrate,steps,calories,gsr,skin_temp,air_temp\n";
$data = array();
for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $d = mysql_fetch_assoc($query);
  echo $d['date_human'] . "," . $d['heartrate'] . "," . $d['steps'] . "," . $d['calories'] . "," . $d['gsr'] . "," . $d['skin_temp'] . "," . $d['air_temp'] . "\n";
}
     
mysql_close($server);
?>