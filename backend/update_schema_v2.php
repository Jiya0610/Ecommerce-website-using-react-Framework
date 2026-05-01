<?php
require_once 'db.php';
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) DEFAULT NULL AFTER username");
    echo "Column full_name added successfully or already exists.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
