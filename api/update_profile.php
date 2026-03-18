<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"];
$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$password = $data["password"] ?? "";
$current_password = $data["current_password"] ?? "";

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Invalid user ID"]);
    exit;
}

// Verify current password if changing password
if ($password) {
    if (!$current_password) {
        echo json_encode(["status" => "error", "message" => "Current password required"]);
        exit;
    }
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }
    
    if ($current_password !== $user['password']) {
        echo json_encode(["status" => "error", "message" => "Current password is incorrect"]);
        exit;
    }
    
    // Validate new password
    if (strlen($password) < 6) {
        echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters"]);
        exit;
    }
}

$updates = [];
$params = [];

if ($name) { $updates[] = "name = ?"; $params[] = $name; }
if ($phone) { $updates[] = "phone = ?"; $params[] = $phone; }
if ($password) { $updates[] = "password = ?"; $params[] = $password; }

if (empty($updates)) {
    echo json_encode(["status" => "error", "message" => "No changes to update"]);
    exit;
}

$params[] = $user_id;

$sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt->execute($params)) {
    if (isset($_SESSION["user_id"]) && $_SESSION["user_id"] == $user_id) {
        if ($name) $_SESSION["user_name"] = $name;
        if ($phone) $_SESSION["user_phone"] = $phone;
    }
    echo json_encode(["status" => "success", "message" => "Profile updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Update failed"]);
}
?>
