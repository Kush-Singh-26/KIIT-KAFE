<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"], $data["password"])) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

$email = trim($data["email"]);
$password = $data["password"];

$stmt = $conn->prepare("SELECT id, name, email, password, phone, role FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    if ($password === $user['password']) {
        $_SESSION["user_id"] = $user['id'];
        $_SESSION["user_name"] = $user['name'];
        $_SESSION["user_email"] = $user['email'];
        $_SESSION["user_phone"] = $user['phone'];
        $_SESSION["user_role"] = $user['role'];

        echo json_encode([
            "status" => "success",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "phone" => $user['phone'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
?>
