<?php
header("Content-Type: application/json");
include "db.php";

if (isset($_SESSION["user_id"])) {
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $_SESSION["user_id"],
            "name" => $_SESSION["user_name"],
            "email" => $_SESSION["user_email"],
            "phone" => $_SESSION["user_phone"],
            "role" => $_SESSION["user_role"]
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "No active session"]);
}
?>
