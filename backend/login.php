<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$data->username]);
        $user = $stmt->fetch();

        if ($user && password_verify($data->password, $user['password'])) {
            echo json_encode([
                "success" => true, 
                "message" => "Successfully login!",
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "full_name" => $user['full_name'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "profile_image" => $user['profile_image'],
                    "created_at" => $user['created_at']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password or username"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}
?>
