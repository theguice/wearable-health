<?php


  // First we execute our common code to connection to the database and start the session 
  require("../common.php"); 

$server = mysql_connect($host, $username, $password);
$connection = mysql_select_db($dbname, $server);

$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$parts = parse_url($url);
parse_str($parts['query'], $param);

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
  $row [] = $d['u_id'];
  $row [] = $d['username'];
  $row [] = $d['pass_insecure'];
  $row [] = $d['begin_date'];
  $row [] = $d['basis_u'];
  $row [] = $d['basis_p'];
  $row [] = $d['lumo_u'];
  $row [] = $d['lumo_p'];
  $row [] = $d['lumo_api'];
  $row [] = $d['moves_u'];
  $row [] = $d['moves_p'];

  date_default_timezone_set('America/Los_Angeles');
  // get latest Basis
  $q = mysql_query("SELECT MAX(date_epoch) as latest FROM wh_d_basis WHERE u_id=" . $d['u_id']);
  $b = mysql_fetch_assoc($q);
  $b = intval($b['latest']);
  $dt = new DateTime($b);
  $row[] = $dt->format('m-d H:i');

  date_default_timezone_set('America/Los_Angeles');
  $q = mysql_query("SELECT MAX(date_epoch) as latest FROM wh_d_lumo WHERE u_id=" . $d['u_id']);
  $b = mysql_fetch_assoc($q);
  $b = intval($b['latest']);
  //$dt2 = new DateTime($b);
  //$row[] = $dt2->format('m-d H:i');
  $row[] = $b;

  $q = mysql_query("SELECT MAX(time_end) as latest FROM wh_d_moves_acts WHERE u_id=" . $d['u_id']);
  $b = mysql_fetch_assoc($q);
  $b = intval($b['latest']);
  //$dt = new DateTime($b);
  //$row[] = $dt->format('m-d H:i');
  $row[] = $b;

  $table[] = $row;
}
echo json_encode($table);
mysql_close($server);
?>