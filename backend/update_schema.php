<?php
require_once 'db.php';

try {
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) DEFAULT NULL AFTER password");
    echo "Column added successfully or already exists.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
