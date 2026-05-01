<?php
require_once 'db.php';

$username = 'john';
$email = 'john@example.com';
$password = password_hash('password123', PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?");
    $stmt->execute([$username, $email, $password, $password]);
    echo "Test user 'john' created/updated with password 'password123'";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
