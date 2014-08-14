<?php
/*
Expected Parameters
user_id: <int>
start_time: <epoc>
end_time: <epoc>

localhost:8888/api/get_paths.php?user_id=1&start_time=1403395200&end_time=1403481600
https://groups.ischool.berkeley.edu/healthstudy/api/get_paths.php?user_id=6
Query:
SELECT * FROM `wh_d_moves_trackpoints` WHERE `u_id`=1 AND 
time > 1403395200 AND 
time < 1403481600
ORDER BY time ASC

SELECT * FROM `wh_d_moves_trackpoints` WHERE `u_id`=6
ORDER BY time ASC;
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
	$timeQueryString = sprintf(" AND time > %u AND time < %u", $param['start_time'], $param['end_time']);
}

$myquery = "SELECT * FROM `wh_d_moves_trackpoints` WHERE `u_id`=" . $param['user_id'] . $timeQueryString . " ORDER BY time ASC";

$query = mysql_query($myquery);
if ( ! $query ) {
  echo mysql_error();
  die;
}

$data = array();

$path_id = "";
$path_activity = "";
$path_data = array();
for ($i=0; $i < mysql_num_rows($query); $i++) {
	$point_data = mysql_fetch_assoc($query);
	if ($path_id != $point_data['path_id']) {
		// new path
		if ($path_id != ""){
			$data[] = array(
			    'path_id'  => $path_id,
			    'activity' => $path_activity,
			    'points' => $path_data
			    );
		}
		
		$path_id = $point_data['path_id'];
		$path_activity = $point_data['activity_type'];
		$path_data = array();
	}else {
		// continue old path
		$path_data[] = array(
			lat => $point_data['lat'],
			lon => $point_data['lon'],
			time => $point_data['time']
			);
	}
}

echo json_encode($data);
mysql_close($server);
?>