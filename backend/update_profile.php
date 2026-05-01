<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db.php';

$userId = $_POST['userId'] ?? null;
$username = $_POST['username'] ?? null;
$fullName = $_POST['fullName'] ?? null;
$profileImage = null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

try {
    // Handle File Upload
    if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['profileImage']['tmp_name'];
        $fileName = $_FILES['profileImage']['name'];
        $fileSize = $_FILES['profileImage']['size'];
        $fileType = $_FILES['profileImage']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $uploadFileDir = './uploads/';
        $dest_path = $uploadFileDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $profileImage = 'backend/uploads/' . $newFileName;
        } else {
            echo json_encode(["success" => false, "message" => "Error moving the uploaded file"]);
            exit;
        }
    }

    // Update Database
    $query = "UPDATE users SET ";
    $params = [];
    
    if ($username) {
        $query .= "username = ?, ";
        $params[] = $username;
    }

    if ($fullName) {
        $query .= "full_name = ?, ";
        $params[] = $fullName;
    }
    
    if ($profileImage) {
        $query .= "profile_image = ?, ";
        $params[] = $profileImage;
    }
    
    // Remove trailing comma and space
    $query = rtrim($query, ", ");
    $query .= " WHERE id = ?";
    $params[] = $userId;

    if (count($params) > 1) {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        
        // Fetch updated user data
        $stmt = $pdo->prepare("SELECT id, username, full_name, email, role, profile_image, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $updatedUser = $stmt->fetch();

        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully",
            "user" => $updatedUser
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "No data to update"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
