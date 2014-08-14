<?php
/*

Expected Parameters
user_id: <int>

localhost:8888/api/get_parameter_ranges.php?user_id=1

Query:
SELECT MIN(CAST(heartrate as Decimal(18,2))), MAX(CAST(heartrate as Decimal(18,2))), MIN(CAST(gsr as Decimal(18,2))), MAX(CAST(gsr as Decimal(18,2))), MIN(CAST(skin_temp as Decimal(18,2))), MAX(CAST(skin_temp as Decimal(18,2))), MIN(CAST(air_temp as Decimal(18,2))), MAX(CAST(air_temp as Decimal(18,2))) FROM `wh_d_basis` WHERE `u_id`=1;


SELECT MIN(CAST(heartrate as Decimal(18,2))) AS heartrate_min, 
MAX(CAST(heartrate as Decimal(18,2))) AS heartrate_max, 
MIN(CAST(gsr as Decimal(18,2))) AS gsr_min, 
MAX(CAST(gsr as Decimal(18,2))) AS gsr_max, 
MIN(CAST(skin_temp as Decimal(18,2))) AS skin_temp_min, 
MAX(CAST(skin_temp as Decimal(18,2))) AS skin_temp_max, 
MIN(CAST(air_temp as Decimal(18,2))) AS air_temp_min, 
MAX(CAST(air_temp as Decimal(18,2))) AS air_temp_max 
FROM `wh_d_basis` WHERE `u_id`=1;




 AND heartrate != 'None' AND heartrate != '0'


SELECT MIN(heartrate), MAX(heartrate), MIN(gsr), MAX(gsr), MIN(skin_temp), MAX(skin_temp), MIN(air_temp), MAX(air_temp) FROM `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'


SELECT MIN(CAST(heartrate as int)) FROM `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'
SELECT MIN(CAST(heartrate as Decimal(18,2))) FROM `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'

SELECT AVG(heartrate) FROM `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'
55.34708077677272

SELECT AVG(CAST(heartrate as Decimal(18,2))) FROM `wh_d_basis` WHERE `u_id`=1 AND heartrate != 'None' AND heartrate != '0'
MIN(CAST(heartrate as Decimal(18,2)))
55.347081


*/
// First we execute our common code to connection to the database and start the session 

require("../common.php");

$server     = mysql_connect($host, $username, $password);
$connection = mysql_select_db($dbname, $server);

$url   = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);

$param['user_id'];

$max_min_query = "SELECT MIN(CAST(heartrate as Decimal(18,2))) AS heartrate_min, 
MAX(CAST(heartrate as Decimal(18,2))) AS heartrate_max, 
MIN(CAST(gsr as Decimal(18,2))) AS gsr_min, 
MAX(CAST(gsr as Decimal(18,2))) AS gsr_max, 
MIN(CAST(skin_temp as Decimal(18,2))) AS skin_temp_min, 
MAX(CAST(skin_temp as Decimal(18,2))) AS skin_temp_max, 
MIN(CAST(air_temp as Decimal(18,2))) AS air_temp_min, 
MAX(CAST(air_temp as Decimal(18,2))) AS air_temp_max 
FROM `wh_d_basis` WHERE `u_id`=" . $param['user_id'];

//echo $max_min_query;

$query = mysql_query($max_min_query);

if (!$query) {
	echo mysql_error();
	die;
}

$data = array();
$d    = array();

for ($x = 0; $x < mysql_num_rows($query); $x++) {
	$data[] = mysql_fetch_assoc($query);
}

//echo $data;

$sensor_data_ranges = array(
"heartrate" => array((float)$data[0]["heartrate_min"],(float)$data[0]["heartrate_max"]),
"gsr" => array((float)$data[0]["gsr_min"],(float)$data[0]["gsr_max"]),
"air_temp" => array((float)$data[0]["air_temp_min"],(float)$data[0]["air_temp_max"]),
"skin_temp" => array((float)$data[0]["skin_temp_min"],(float)$data[0]["skin_temp_max"]),
"calories" => array(0,6000),
"steps" => array(0,15000)
);
//TODO: do calculations to find out the ranges for the sum of the calories and the steps

echo json_encode($sensor_data_ranges);

mysql_close($server);
?>

