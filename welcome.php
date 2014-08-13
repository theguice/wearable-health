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
     
// We can display the user's username to them by reading it from the session array.  Remember that because 
// a username is user submitted content we must use htmlentities on it before displaying it to the user. 
?> 

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome</title>
  <link rel='stylesheet' href='https://codepen.io/assets/libs/fullpage/jquery-ui.css'>
  <link rel="stylesheet" href="assets/_css/login.css" type="text/css">
</head>

<body>
  <div class="login-card instructions">
    <h1>Welcome <?php echo ucfirst($_SESSION['user']['username']); ?></h1><br>
    <h3>Before we begin:</h3>
    
<div id="moves">
<h3><input type="checkbox" class="checks required">Moves</h3>
    <label>I have imported my latest moves data</label>
    <ul>
		<li><a href="https://accounts.moves-app.com/export">Download your latest moves data here</a></li>
		<li>Upload your moves-export zip file here:</li>
	</ul>
	<form action="upload.php" method="post" enctype="multipart/form-data">
	    <label for="file">Filename:</label>
	    <input type="file" name="file" id="file"><br>
	    <input type="submit" name="submit" value="Upload" class="login login-submit">
	</form>
</div>
<div id="basis">
<h3><input type="checkbox" class="checks required">Basis</h3>

	<label>I have plugged in my basis watch to charge & sync</label><br/>
	<img width="150" height="auto" src="assets/_img/basis-charging.jpg"/>
</div>

<div id="lumo">
<h3><input type="checkbox" class="checks required">Lumo</h3>

	<label>I have launched the Lumo App on my smartphone to sync</label><br/>
	<img width="150" height="auto" src="assets/_img/lumo-sync.jpg"/>
</div>

<div class="login login-submit" id="button" style="display:none;">
  <a class="login login-submit" href="dashboard.php"><button type="button" class="login login-submit">View Data Portal</button></a>
</div>


   
</div>
<script>
  $(".required").on('change', function(){
      console.log($('.required:checked').length, $('.required').length);
    if ($('.required:checked').length == $('.required').length) {
      // user has checked all boxes for steps to take
      // show them the button
      $("#button").show();
    }
  });
</script>
<script src='https://codepen.io/assets/libs/fullpage/jquery_and_jqueryui.js'></script>

</body>

</html>