<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

include('db_connection.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

$requestPayload = file_get_contents('php://input');
$data = json_decode($requestPayload, true);
$email = $data['email'] ?? '';
$type = $data['type'] ?? '';
$otp = $data['otp'] ?? ''; // Added OTP field
// Validate email
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$email = filter_var($email, FILTER_VALIDATE_EMAIL);
if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

// Check if the user exists in the database
$sel_query = "SELECT * FROM `users` WHERE email='" . $email . "'";
$results = mysqli_query($conn, $sel_query);

if (!$results) {
    echo json_encode(['status' => 'error', 'message' => 'Database query failed: ' 
            . mysqli_error($conn)]);
    exit;
}

$row = mysqli_num_rows($results);
if ($row == 0) {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
    exit;
}

// Generate a unique token and expiration date
$expFormat = mktime(date("H"), date("i"), date("s"), date("m"), date("d") + 1, date("Y"));
$expDate = date("Y-m-d H:i:s", $expFormat);
$token = bin2hex(random_bytes(16));

// Insert token into the temporary table
$insert_query = "INSERT INTO `password_reset_temp` (`email`, `key`, `expDate`) 
    VALUES ('" . $email . "', '" . $token . "', '" . $expDate . "')";
if (!mysqli_query($conn, $insert_query)) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' 
        . mysqli_error($conn)]);
    exit;
}

$frontendUrl = 'http://localhost:4200/reset_password';
if ($type == 'verify_user') {
    $frontendUrl = 'http://localhost:4200/user_verification';
}

// Generate the reset link
$resetLink = $frontendUrl . '?token=' . urlencode($token) . '&email=' 
        . urlencode($email);

// Load the email template based on the type of email to send
$templateFile = '';
if ($type == 'verify_user') {
    $templateFile = 'verify_user_email.html';
} elseif ($type == 'forgot_password') {
    $templateFile = 'forgot_password_email.html';
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email type']);
    exit;
}

$template = file_get_contents('../email_templates/'. $templateFile);
$template = str_replace('{{resetLink}}', htmlspecialchars($resetLink), $template);
$template = str_replace('{{year}}', date('Y'), $template);

if ($type == 'verify_user') {
    $template = str_replace('{{otp}}', htmlspecialchars($otp), $template);
}

try {
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'innovatech757@gmail.com';
    $mail->Password   = 'zzwf atml pjuc lkrs';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('from@example.com', 'Flavorfusion.tech');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = ($type == 'verify_user') ? 'Verify Your Account' :
             'Reset Your Password';
    $mail->Body    = $template;

    $mail->send();
    echo json_encode(['status' => 'success', 'message' => 
        'Email has been sent']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 
        "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>
