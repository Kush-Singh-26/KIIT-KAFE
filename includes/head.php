<!DOCTYPE html>
<html lang="en">
<head>
<?php
  // Calculate dynamic base path based on the script location relative to server root
  $basePath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
  if ($basePath !== '/') $basePath .= '/';
  echo "<base href=\"$basePath\">";
?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIIT KAFE — Campus 25</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>