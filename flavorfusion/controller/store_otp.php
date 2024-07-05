<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

include('db_connection.php');

$email = $_POST['email'];
$otp = $_POST['otp'];

if (empty($email) || empty($otp)) {
    echo json_encode(['success' => false, 'message' => 
            'Email and OTP are required.']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO verification_temp (email, otp_code) 
        VALUES (?, ?)");
$stmt->bind_param("ss", $email, $otp);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 
            'OTP stored successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to store OTP.']);
}

$stmt->close();
$conn->close();
?>
