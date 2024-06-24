<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['avatar']) && isset($_POST['user_id'])) {
        $userId = $_POST['user_id'];
        $avatar = $_FILES['avatar'];

        $fileType = mime_content_type($avatar['tmp_name']);
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (in_array($fileType, $allowedTypes)) {
            $avatarData = file_get_contents($avatar['tmp_name']);

            $stmt = $conn->prepare("UPDATE user_profiles SET 
                profile_picture = ? WHERE user_id = ?");
            $stmt->bind_param('si', $avatarData, $userId);

            if ($stmt->execute()) {
                $stmt = $conn->prepare("SELECT profile_picture FROM 
                    user_profiles WHERE user_id = ?");
                $stmt->bind_param('i', $userId);
                $stmt->execute();
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();

                echo json_encode([
                    'success' => true,
                    'profile_picture' => 'data:' . $fileType . ';base64,'
                        . base64_encode($user['profile_picture'])
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' =>
                        'Failed to update profile picture'
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                'success' => false,
                'message' =>
                    'Invalid file type'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' =>
                'No file or user ID provided'
        ]);
    }
}

$conn->close();
?>