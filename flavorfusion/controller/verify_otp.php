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

$stmt = $conn->prepare("SELECT * FROM verification_temp 
    WHERE email = ? AND otp_code = ?");
$stmt->bind_param("ss", $email, $otp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // OTP matched, proceed with user registration
    echo json_encode(['success' => true, 'message' => 
        'OTP verified successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid OTP.']);
}

$stmt->close();
$conn->close();
?>
