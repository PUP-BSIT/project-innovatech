<?php
session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
} else {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

header("Content-Type: application/json; charset=UTF-8");

include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['username']) && isset($data['bio'])) {
        $username = $data['username'];
        $bio = $data['bio'];

        $sql = "UPDATE user_profiles SET username = ?, bio = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $username, $bio, $user_id);

        if ($stmt->execute()) {
            // Fetch the updated profile data
            $sql = "SELECT u.user_id, u.email, up.username, up.bio 
                    FROM users u 
                    JOIN user_profiles up ON u.user_id = up.user_id 
                    WHERE u.user_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();

            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode([
                'success' => false,
                'message' =>
                    'Database update failed'
            ]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' =>
            'User not logged in or invalid request method'
    ]);
}
?>