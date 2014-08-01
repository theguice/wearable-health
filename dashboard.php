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
<html class="no-js">
<head>
	<meta charset="utf-8">
	<meta http-equiv="cache-control" content="max-age=0">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="pragma" content="no-cache"><!-- All style rules found here -->

	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Health Viz</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">
	
	<link rel="stylesheet" href="assets/_css/main.css" type="text/css">
	
	<script src="assets/_js/vendor/modernizr-2.6.1.min.js"></script>
	<script type="text/javascript" src="assets/_lib/d3.v3.min.js"></script>
	<script type="text/javascript" src="assets/_lib/jquery-1.11.1.min.js"></script>
	<link rel="stylesheet" href="assets/_lib/bootstrap/css/bootstrap.min.css" type="text/css">
	<script src="assets/_lib/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBLPJEHtrhCrnosJLI6_cSpmELl7y1BPnQ"></script>

</head>
<body>
    <!--[if lt IE 7]>
        <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
    <![endif]-->

<!-- Website Header -->
    <header id="header">
      <div class="container">
        <div class="navbar">
          <a class="brand" id="logo" href="index.html">StartUp</a>
          <ul>
            <li class="active"><a href="index.html">Dashboard</a></li>
            <li><a href="about.html">About</a></li>
<!--             <li><a href="blog.html">Blog</a></li> -->
            <li><a href="contact.html">Contact</a></li>
<!--             TODO: php script to use actual user name -->
            <li><a href="#" class="dropdown-toggle" data-toggle="dropdown">User Name »</a>
              <ul class="dropdown-menu" role="menu" aria-labelledby="drop2">
                <li><a href="#">Coming soon - iPhone</a></li>
                <li><a href="#">Coming soon - iPhone 5</a></li>
               <!--
 <li><a href="coming-soon-ipad.html">Coming soon - iPad</a></li>
                <li><a href="coming-soon-mac.html">Coming soon - MacBook</a></li>
                <li><a href="index.html">Frontpage - iPhone</a></li>
                <li><a href="index-iphone5.html">Frontpage - iPhone 5</a></li>
                <li><a href="index-ipad.html">Frontpage - iPad</a></li>
                <li><a href="index-mac.html">Frontpage - MacBook</a></li>
                <li><a href="about.html">Page</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="blog-single.html">Blog post</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="elements.html">Elements</a></li>
-->
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header> <!-- /#header -->

    <!-- Top section for averages and comparison bars -->
    <div class="container" role="main">
    <div class="span-text-top">
	<h2>Health Data Visualization</h2>
	<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.


	</p>	
	
	</div>
	<div class="span11">
	<div id="compare">
        <div class="heartrate top"></div>

        <div class="steps top"></div>

        <div class="calories top"></div>

        <div class="gsr top"></div>

<!--         <div class="posture top"></div> -->

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
	</div><!-- Span11 -->
      <footer>
        <p>
          © 2014 UC Berkeley <a href="about.html">About</a> <a href="contact.html">Contact</a> 
        </p>
      </footer>

    </div> <!-- /container -->



    
    
    <br>
    <br>
    <br>
    <div class="compare">
		<button id="addComparison" style="display:none">Add</button>
    </div>
    <footer class="center"><a href="logout.php">Logout</a> <span>|</span> <a href="edit_account.php">Edit</a></footer>
    
    <!-- setup.js holds global vars and click-handlers -->
    <script src="assets/_js/setup.js" type="text/javascript"></script>
    <!-- main_graph.js holds all d3 logic for the main visualization -->
    <script src="assets/_js/main_graph.js" type="text/javascript"></script>
    <!-- top_bars.js holds d3 logic for the average bar-graphs at the top of the page -->
    <script src="assets/_js/top_bars.js" type="text/javascript"></script>
    <!-- map_custom.js is where you specify map style, and setup markers -->
    <script src="assets/_js/map_custom.js" type="text/javascript"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="assets/_js/vendor/jquery-1.8.0.min.js"><\/script>')</script>

    <script src="assets/_js/plugins.js"></script>
    <script src="assets/_js/main.js"></script>
</body>
</html>
