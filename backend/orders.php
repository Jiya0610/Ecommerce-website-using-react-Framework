<?php
require_once 'db.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Create orders table if it doesn't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    items JSON NOT NULL,
    shipping JSON NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    cod_fee DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    cancel_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Add cancel_reason column if it doesn't exist (for existing tables)
try {
    $pdo->exec("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT DEFAULT NULL");
} catch (Exception $e) {
    // Column might already exist, ignore
}

$method = $_SERVER['REQUEST_METHOD'];

// ---- POST: Create new order ----
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $status = $data['status'] ?? 'Pending';
    
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, items, shipping, payment_method, subtotal, discount, cod_fee, total, coupon_code, status)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['user_id'],
        json_encode($data['items']),
        json_encode($data['shipping']),
        $data['payment_method'],
        $data['subtotal'],
        $data['discount'] ?? 0,
        $data['cod_fee'] ?? 0,
        $data['total'],
        $data['coupon_code'] ?? null,
        $status
    ]);
    
    echo json_encode(['success' => true, 'order_id' => $pdo->lastInsertId()]);
}

// ---- GET: Fetch orders for a user ----
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'user_id required']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll();
    
    // Decode JSON columns
    foreach ($orders as &$order) {
        $order['items'] = json_decode($order['items'], true);
        $order['shipping'] = json_decode($order['shipping'], true);
    }
    
    echo json_encode(['success' => true, 'orders' => $orders]);
}

// ---- PUT: Cancel an order ----
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $order_id = $data['order_id'] ?? null;
    $cancel_reason = $data['cancel_reason'] ?? null;
    
    if (!$order_id) {
        echo json_encode(['success' => false, 'message' => 'order_id required']);
        exit;
    }
    
    // Only allow cancellation of Pending or Confirmed orders
    $stmt = $pdo->prepare("UPDATE orders SET status = 'Cancelled', cancel_reason = ? WHERE id = ? AND status IN ('Pending', 'Confirmed')");
    $stmt->execute([$cancel_reason, $order_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Order cancelled successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Order cannot be cancelled or already cancelled']);
    }
}
?>
