<?php
require("common.php"); 

$allowedExts = array("zip");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

if (($_FILES["file"]["type"] == "application/zip")
    && ($_FILES["file"]["size"] < 40000000)
    && in_array($extension, $allowedExts)) {
  if ($_FILES["file"]["error"] > 0) {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
  } else {
    if (file_exists("uploads/" . $_FILES["file"]["name"])) {
      //echo $_FILES["file"]["name"] . " already exists. ";
      // unlink deletes the file that was there previously
      unlink("uploads/" . $_FILES["file"]["name"]);
    } else {
      $status = move_uploaded_file($_FILES["file"]["tmp_name"], "uploads/tmp.zip");
      //echo "Stored in: " . "uploads/moves_export_user_" . $_SESSION['user']['id'];
      if (!$status) {
	echo "Upload failed!";
      } else {
	// the upload was successful, so lets run the save_to_db script to catch the uploaded files into the db
	echo "Please Wait, uploading your latest data...";

	// clear out old dir if it exists. need to do that because the zip extractor won't be able to overwrite
	if (file_exists("uploads/moves_export_user_" . $_SESSION["user"]["u_id"])) {
	  // delete tmp_extracted folder
	  foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator("uploads/moves_export_user_" . $_SESSION["user"]["u_id"], FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST) as $path) {
	    $path->isDir() ? rmdir($path->getPathname()) : unlink($path->getPathname());
	  }
	  rmdir("uploads/moves_export_user_" . $_SESSION["user"]["u_id"]);
	}

	//unzip the file
	$zip = new ZipArchive;
	$res = $zip->open('uploads/tmp.zip');
	if ($res === TRUE) {
	  $zip->extractTo('uploads/tmp_extracted/');
	  $zip->close();
	  $zip = new ZipArchive;
	  $res = $zip->open('uploads/tmp_extracted/json.zip');
	  if ($res === TRUE) {
	    $zip->extractTo('uploads/moves_export_user_' . $_SESSION['user']['u_id']);
	    $zip->close();
	    // remove tmp.zip file
	    unlink('uploads/tmp.zip');
	    // delete tmp_extracted folder
	    foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator('uploads/tmp_extracted/', FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST) as $path) {
	      $path->isDir() ? rmdir($path->getPathname()) : unlink($path->getPathname());
	    }
	    rmdir('uploads/tmp_extracted/');
	  } else {
	    echo 'doh!  (unzip fail)';
	  }
	} else {
	  echo 'doh! (unzip fail)';
	}

	// It would be ideal to run the script that updates moves data right here and now
	//    at the moment save_to_db.py runs the import for ALL USERS and ALL DEVICES
	//   an obviously necessary improvement would be to pass in the $_SESSION['user']['u_id'], and limit this particular upload to just moves data for a particular user... because thats what they just uploaded, and they have to WAIT for it to finish.

	// this system call seems to not be working
	//$out = system("./groups/healthstudy/public_html.ssl/control_panel/save_to_db.py");

	/*************
        THIS IS WHERE YOU CAN CALL save_to_db with two arguments:  USER_ID and DEVICE
        (see researcher guide for notes on this)
        *************/



	//header("Location: welcome.php"); 
	//die("Redirecting to: welcome.php");
      }
    }
  }
} else {
  echo "Invalid file";
}
?>