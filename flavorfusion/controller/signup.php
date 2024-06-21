<?php
include_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode(["message" => "Invalid input"]);
    exit;
}

$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);

$query = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $password);

//kyla added
try {
    $query = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $email, $password);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;

        // Insert into user_profiles with default username as email
        $query_profile = "INSERT INTO user_profiles (user_id, username, bio)
             VALUES (?, ?, ?)";
        $stmt_profile = $conn->prepare($query_profile);
        $username = $email;
        $bio = '';
        $stmt_profile->bind_param("iss", $user_id, $username, $bio);

        if ($stmt_profile->execute()) {
            echo json_encode([
                "success" => true,
                "message" =>
                    "User registered successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" =>
                    "Profile creation failed: " . $stmt_profile->error
            ]);
        }

        $stmt_profile->close();
    } else {
        throw new Exception("Error: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>