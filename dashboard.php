<?php 

// First we execute our common code to connection to the database and start the session 
require("common.php"); 
     
// At the top of the page we check to see whether the user is logged in or not 
if(empty($_SESSION['user'])) 
{ 
	// If they are not, we redirect them to the login page.
	header("Location: login.php"); 
	     
	// Remember that this die statement is absolutely critical.  Without it, 
	// people can view your members-only content without logging in. 
	die("Redirecting to login.php"); 
} 
     
// Everything below this point in the file is secured by the login system 
?>
<!DOCTYPE html>

<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="cache-control" content="max-age=0">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache"><!-- All style rules found here -->
	<link rel="stylesheet" href="assets/_css/main.css" type="text/css"><!-- Libs -->
	
	<script type="text/javascript" src="assets/_lib/d3.v3.min.js"></script>
	<script type="text/javascript" src="assets/_lib/tooltip.js"></script>
	<script type="text/javascript" src="assets/_lib/jquery-1.11.1.min.js"></script>
	<link rel="stylesheet" href="assets/_lib/bootstrap/css/bootstrap.min.css" type="text/css">
	<script src="assets/_lib/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLPJEHtrhCrnosJLI6_cSpmELl7y1BPnQ"></script>
	
	<title></title>
</head>

<body>
    <!-- Top section for averages and comparison bars -->

    <div id="compare">
        <div class="heartrate top"></div>

        <div class="steps top"></div>

        <div class="calories top"></div>

        <div class="gsr top"></div>

        <div class="posture top"></div>

        <div class="skin_temp top"></div>

        <div class="air_temp top"></div>
    </div><!-- Main visualization is adapted from:
            http://bl.ocks.org/gniemetz/4618602
            http://jsfiddle.net/JGytk/
    -->

    <div id="main"></div>

    <div id="side">
        <div id="map-canvas"></div>
    </div>
    
    <br>
    <br>
    <br>

    <footer class="center"><a href="logout.php">Logout</a> <span>|</span> <a href="edit_account.php">Edit</a></footer>
    
    <!-- setup.js holds global vars and click-handlers -->
    <script src="assets/_js/setup.js" type="text/javascript"></script>
    <!-- main_graph.js holds all d3 logic for the main visualization -->
    <script src="assets/_js/main_graph.js" type="text/javascript"></script>
    <!-- top_bars.js holds d3 logic for the average bar-graphs at the top of the page -->
    <script src="assets/_js/top_bars.js" type="text/javascript"></script>
    <!-- map_custom.js is where you specify map style, and setup markers -->
    <script src="assets/_js/map_custom.js" type="text/javascript"></script>
</body>
</html>
