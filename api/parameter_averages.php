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

//echo json_encode($data);     
echo json_encode($d);
     
mysql_close($server);
?>