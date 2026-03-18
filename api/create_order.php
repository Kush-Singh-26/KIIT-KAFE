<?php
header("Content-Type: application/json");
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["order_code"], $data["user_id"], $data["total"], $data["payment_method"], $data["items"])) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

$order_code = $data["order_code"];
$user_id = $data["user_id"];
$total = $data["total"];
$payment = $data["payment_method"];
$items = $data["items"];

try {
    $conn->beginTransaction();

    foreach ($items as $item) {
        $food_id = $item["id"];
        $qty = $item["qty"];

        $checkStock = $conn->prepare("SELECT quantity FROM stock WHERE food_id = ?");
        $checkStock->execute([$food_id]);
        $stockRow = $checkStock->fetch();

        if (!$stockRow || $stockRow['quantity'] < $qty) {
            $conn->rollBack();
            echo json_encode(["status" => "error", "message" => "Insufficient stock for item: " . $item["name"]]);
            exit;
        }

        $deduct = $conn->prepare("UPDATE stock SET quantity = quantity - ? WHERE food_id = ?");
        $deduct->execute([$qty, $food_id]);
    }

    $initialStatus = 'Pending';
    $stmt = $conn->prepare("INSERT INTO orders (order_code, user_id, payment_method, total, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$order_code, $user_id, $payment, $total, $initialStatus]);
    $order_id = $conn->lastInsertId();

    foreach ($items as $item) {
        $insItem = $conn->prepare("INSERT INTO order_items (order_id, food_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?)");
        $insItem->execute([$order_id, $item["id"], $item["name"], $item["qty"], $item["price"]]);
    }

    $conn->commit();

    echo json_encode(["status" => "success", "order_id" => $order_id]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Order failed: " . $e->getMessage()]);
}
?>
