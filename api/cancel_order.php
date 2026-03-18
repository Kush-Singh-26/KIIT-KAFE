<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data["order_id"] ?? null;
$user_id = $_SESSION["user_id"] ?? null;

if (!$order_id || !$user_id) {
    echo json_encode(["status" => "error", "message" => "Unauthorized or missing ID"]);
    exit;
}

// Update order status to 'Cancelled' only if it's currently 'Pending' and belongs to the user
$stmt = $conn->prepare("UPDATE orders SET status = 'Cancelled' WHERE id = ? AND user_id = ? AND status = 'Pending'");
if ($stmt->execute([$order_id, $user_id])) {
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Order cancelled"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Order cannot be cancelled (already processed or not found)"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>
