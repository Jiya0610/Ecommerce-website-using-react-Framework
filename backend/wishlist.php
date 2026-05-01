<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

try {
    if ($method === 'POST') {
        if (!empty($data->user_id) && !empty($data->product_id)) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)");
            $stmt->execute([$data->user_id, $data->product_id]);
            echo json_encode(["success" => true, "message" => "Added to wishlist"]);
        } else {
            echo json_encode(["success" => false, "message" => "Missing data"]);
        }
    } elseif ($method === 'GET') {
        $user_id = $_GET['user_id'] ?? null;
        if ($user_id) {
            $stmt = $pdo->prepare("SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE w.user_id = ?");
            $stmt->execute([$user_id]);
            $items = $stmt->fetchAll();
            echo json_encode(["success" => true, "items" => $items]);
        } else {
            echo json_encode(["success" => false, "message" => "User ID required"]);
        }
    } elseif ($method === 'DELETE' || (isset($_GET['action']) && $_GET['action'] === 'remove')) {
        // Support both DELETE method and POST with action=remove for easier frontend handling
        $user_id = $_GET['user_id'] ?? $data->user_id ?? null;
        $product_id = $_GET['product_id'] ?? $data->product_id ?? null;
        
        if ($user_id && $product_id) {
            $stmt = $pdo->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$user_id, $product_id]);
            echo json_encode(["success" => true, "message" => "Removed from wishlist"]);
        } else {
            echo json_encode(["success" => false, "message" => "Missing data"]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
