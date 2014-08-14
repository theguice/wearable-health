<?php
/*

Expected Parameters
user_id: <int>
start_time: <epoc>
end_time: <epoc>

localhost:8888/api/get_places.php?user_id=1&start_time=1403395200&end_time=1403481600

Query:
SELECT * FROM `wh_d_moves_places` WHERE `u_id`=1 AND 
(time_start > 1403395200 AND 
time_start < 1403481600) OR 
(time_end > 1403395200 AND 
time_end < 1403481600)
ORDER BY time_start ASC
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

$data = array();
$coords = array();


/*  If you want to see more granular locations, you could do this query from the trackpoints table instead.  As long as you build the $data array in the same format, everything that this depends on will keep working the same, just with more points.

I think this would be really cool, especially when the user zooms in to a day or lower, and can follow their path along the map as they move across the main viz.

If you do try this, you'll probably want to reduce the marker radius in the map_custom.js file
*/
$timeQueryString = "";
if ($param['start_time']  && $param['end_time'])
{	
	$timeQueryString = sprintf(" AND (time_start > %u AND time_start < %u) OR (time_end > %u AND time_end < %u)", $param['start_time'], $param['end_time'], $param['start_time'], $param['end_time']);
}

$myquery = "SELECT * FROM `wh_d_moves_places` WHERE `u_id`=" . $param['user_id'] . $timeQueryString . " ORDER BY time_start ASC";

$query = mysql_query($myquery);
if ( ! $query ) {
  echo mysql_error();
  die;
}

// Build the array $data before sending it back as a json array

$data['places'] = array();
for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $d = mysql_fetch_assoc($query);
  $data['places'][] = $d;
  $coords[$x] = array( $d['lat'], $d['lon'] );
}

$data['center'] = GetCenterFromDegrees($coords);


echo json_encode($data);
mysql_close($server);

/**
 * Get a center latitude,longitude from an array of like geopoints
 *
 * @param array data 2 dimensional array of latitudes and longitudes
 * For Example:
 * $data = array
 * (
 *   0 = > array(45.849382, 76.322333),
 *   1 = > array(45.843543, 75.324143),
 *   2 = > array(45.765744, 76.543223),
 *   3 = > array(45.784234, 74.542335)
 * );
 */
function GetCenterFromDegrees($data)
{
  if (!is_array($data)) return FALSE;

  $num_coords = count($data);

  $X = 0.0;
  $Y = 0.0;
  $Z = 0.0;

  foreach ($data as $coord)
    {
      $lat = $coord[0] * pi() / 180;
      $lon = $coord[1] * pi() / 180;

      $a = cos($lat) * cos($lon);
      $b = cos($lat) * sin($lon);
      $c = sin($lat);

      $X += $a;
      $Y += $b;
      $Z += $c;
    }

  $X /= $num_coords;
  $Y /= $num_coords;
  $Z /= $num_coords;

  $lon = atan2($Y, $X);
  $hyp = sqrt($X * $X + $Y * $Y);
  $lat = atan2($Z, $hyp);

  return array($lat * 180 / pi(), $lon * 180 / pi());
}
?>