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
<link rel="stylesheet" href="assets/_css/basic.css">

  <div class="center">
    <h1>Welcome, <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?></h1><br />

    <div class="checks">
      <h3>Before we begin:</h3>
      <div id="moves">
	<label><input type="checkbox" class="checks">I have imported my latest moves data</label><br/>
	<ul>
	  <li><a href="https://accounts.moves-app.com/export">Download your latest moves data here</a></li>
	  <li>Upload your moves-export zip file here:</li>
<form action="upload.php" method="post" enctype="multipart/form-data">
<label for="file">Filename:</label>
<input type="file" name="file" id="file"><br>
<input type="submit" name="submit" value="Submit">
</form>
	</ul>
      </div>
      <div id="basis">
	<label><input type="checkbox" class="checks">I have plugged in my basis watch to charge & sync</label><br/>
        <img width="150" height="auto" src="assets/_img/basis-charging.jpg"/>
      </div>
      <div id="lumo">
	<label><input type="checkbox" class="checks">I have launched the Lumo App on my smartphone to sync</label><br/>
        <img width="150" height="auto" src="assets/_img/lumo-sync.jpg"/>
      </div>
    </div>
  </div>

