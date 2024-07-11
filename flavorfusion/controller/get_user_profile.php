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

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $sql = "SELECT u.user_id, u.email, up.username, up.bio, up.profile_picture
            FROM users u 
            LEFT JOIN user_profiles up ON u.user_id = up.user_id 
            WHERE u.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (empty($user['username'])) {
        $user['username'] = $user['email'];
    }

    if ($user) {
        if ($user['profile_picture']) {
            $user['profile_picture'] = 'data:image/jpeg;base64,'
                . base64_encode($user['profile_picture']);
        } else {
            $user['profile_picture'] = 'assets/images/default-avatar.png';
        }
    }

    echo json_encode($user);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['message' => 'User not logged in']);
}

?>