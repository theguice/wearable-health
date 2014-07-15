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

//if ($param['heartrate'] == 1) {
$myquery = "SELECT * FROM wh_users";
$query = mysql_query($myquery);

if ( ! $query ) {
  echo mysql_error();
  die;
}
    
$data = array();
$table = array();

for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $d = mysql_fetch_assoc($query);

  $row = array();
  $row [] = $d['name'];
  $row [] = $d['u_id'];
  $row [] = $d['begin_date'];
  $row [] = "sync button";

  // count basis rows
  $q = mysql_query("SELECT u_id FROM wh_d_basis WHERE u_id=" . $d['u_id']);
  $count = mysql_num_rows($q);
  $row [] = $count;

  $row [] = "todo";
  $row [] = "todo";


  $table[] = $row;
  // save $d for good measure
  //$data[] = $d;
}

//Name,User ID,Begin Date,Last Synced,Basis,Lumo,Moves
/*
while ($k = current($data[0])) {
  $d[] = array('name' => key($data[0]), 'value' => $data[0][key($data[0])] );
  next($data[0]);
}
*/

echo json_encode($table);
mysql_close($server);
?>