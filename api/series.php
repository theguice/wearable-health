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

/*
if ($param['heartrate'] == 1) {
  $myquery = "SELECT  AVG(heartrate) as heartrate FROM  `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'";
} else if ($param['steps'] == 1) {
  $myquery = "SELECT  AVG(steps) as steps  FROM  `wh_d_basis` WHERE `u_id`=1 AND steps != 'None'";
} else {
  // quit
  exit();
}
*/

$myquery = "SELECT  heartrate,steps,calories,gsr,skin_temp,air_temp FROM  `wh_d_basis` WHERE `u_id`=1 SORT BY date_epoch ASC";
$query = mysql_query($myquery);

if ( ! $query ) {
  echo mysql_error();
  die;
}
    
$data = array();

echo "timestamp,heartrate,steps,calories,gsr,skin_temp,air_temp";
for ($x = 0; $x < mysql_num_rows($query); $x++) {
    $data[] = mysql_fetch_assoc($query);
    
}
echo $data

//echo json_encode($data);     
//echo json_encode($d);
     
mysql_close($server);
?>