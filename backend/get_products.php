<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

try {
    $id = $_GET['id'] ?? null;
    $category = $_GET['category'] ?? 'All';
    $sort = $_GET['sort'] ?? 'newest';
    $minPrice = $_GET['minPrice'] ?? 0;
    $maxPrice = $_GET['maxPrice'] ?? 999999;

    if ($id) {
        $query = "SELECT * FROM products WHERE id = ?";
        $params = [$id];
    } else {
        $query = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
        $params = [$minPrice, $maxPrice];

        if ($category !== 'All') {
            $query .= " AND category = ?";
            $params[] = $category;
        }
    }

    switch ($sort) {
        case 'price-low-high':
            $query .= " ORDER BY price ASC";
            break;
        case 'price-high-low':
            $query .= " ORDER BY price DESC";
            break;
        case 'rating':
            $query .= " ORDER BY rating DESC";
            break;
        case 'newest':
        default:
            $query .= " ORDER BY created_at DESC";
            break;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Fetch categories and counts
    $catStmt = $pdo->query("SELECT category, COUNT(*) as count FROM products GROUP BY category");
    $categories = $catStmt->fetchAll();

    echo json_encode([
        "success" => true,
        "products" => $products,
        "categories" => $categories,
        "count" => count($products)
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
