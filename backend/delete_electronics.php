<?php
require 'backend/db.php';
$stmt = $pdo->prepare("DELETE FROM products WHERE category = 'Electronics'");
$stmt->execute();
echo $stmt->rowCount() . " products deleted from Electronics category.";
?>
