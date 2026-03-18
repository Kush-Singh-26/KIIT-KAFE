<?php
header("Content-Type: application/json");
include "db.php";

session_unset();
session_destroy();

echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
?>
