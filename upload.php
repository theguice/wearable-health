<?php
require("common.php"); 

$allowedExts = array("zip");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);
#echo var_dump($_FILES);
#echo var_dump($_SESSION['user']);

if (($_FILES["file"]["type"] == "application/zip")
    && ($_FILES["file"]["size"] < 40000000)
    && in_array($extension, $allowedExts)) {
  if ($_FILES["file"]["error"] > 0) {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
  } else {
    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
    echo "Type: " . $_FILES["file"]["type"] . "<br>";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
    if (file_exists("uploads/" . $_FILES["file"]["name"])) {
      //echo $_FILES["file"]["name"] . " already exists. ";
      // unlink deletes the file that was there previously
      unlink("uploads/" . $_FILES["file"]["name"]);
    } else {
      $status = move_uploaded_file($_FILES["file"]["tmp_name"],
			 "uploads/moves_export_user_" . $_SESSION['user']['id']);
      //echo "Stored in: " . "uploads/moves_export_user_" . $_SESSION['user']['id'];
      if (!$status) {
	echo "Upload failed!";
      } else {
	// the upload was successful, so lets run the save_to_db script to catch the uploaded files into the db
	system("/groups/healthstudy/public_html.ssl/control_panel/save_to_db.py");
      }
    }
  }
} else {
  echo "Invalid file";
}
?>