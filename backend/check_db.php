<?php
require_once 'db.php';
$stmt = $pdo->query("SELECT name, image_url FROM products WHERE category = 'Beauty & Health'");
while($row = $stmt->fetch()) {
    echo "Product: " . $row['name'] . "\nImage: " . $row['image_url'] . "\n---\n";
}
?>
