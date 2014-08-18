<?php
/*
Expected Parameters
user_id: <int>
start_time: <epoc>
end_time: <epoc>

localhost:8888/api/get_activity.php?user_id=1&start_time=1403395200&end_time=1403481600
https://groups.ischool.berkeley.edu/healthstudy/api/get_activity.php?user_id=6
Query:
SELECT * FROM `wh_d_moves_acts` WHERE `u_id`=2 AND 
(time_start > 1403395200 AND 
time_start < 1403481600) OR 
(time_end > 1403395200 AND 
time_end < 1403481600)
ORDER BY time_start ASC


output:
[
	{
	time_start:<epoc>,
	time_end:<epoc>,
	type:<string: place/move>,
	act:<string: waling, cycling, transport, biking>,
	duration: <double>,
	distance: <double>,
	steps: <int/None>
	},
]
*/
  // First we execute our common code to connection to the database and start the session 
require("../common.php"); 

$server = mysql_connect($host, $username, $password);
$connection = mysql_select_db($dbname, $server);

$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);

//$param['user_id'] = 1;
if (!$param['user_id']) {
  exit();
}


$timeQueryString = "";
if ($param['start_time']  && $param['end_time'])
{	
	$timeQueryString = sprintf(" AND (time_start > %u AND time_start < %u) OR (time_end > %u AND time_end < %u)", $param['start_time'], $param['end_time'], $param['start_time'], $param['end_time']);
}

$myquery = "SELECT * FROM `wh_d_moves_acts` WHERE `u_id`=" . $param['user_id'] . $timeQueryString . " ORDER BY time_start ASC";

$query = mysql_query($myquery);
if ( ! $query ) {
  echo mysql_error();
  die;
}

$data = array();

for ($i=0; $i < mysql_num_rows($query); $i++) {
	$activity_data = mysql_fetch_assoc($query);
	$data[] = $activity_data;
}
echo json_encode($data);
mysql_close($server);

?>