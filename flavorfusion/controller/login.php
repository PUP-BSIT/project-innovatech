<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');  
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

include_once 'db_connection.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$email = mysqli_real_escape_string($conn, $request->email);
$password = mysqli_real_escape_string($conn, $request->password);

if (empty($email) || empty($password)) {
    echo json_encode(array('success' => false, 'message' => 'Email and password are required.'));
    exit;
}

$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password_hash'])) {
        // Password correct, login successful
        session_start();
        $_SESSION['user_id'] = $row['user_id'];
        $_SESSION['email'] = $row['email'];
        echo json_encode(array('success' => true));
    } else {
        // Password incorrect
        echo json_encode(array('success' => false, 'message' => 'Incorrect password.'));
    }
} else {
    // User not found
    echo json_encode(array('success' => false, 'message' => 'User not found.'));
}

$conn->close();
?>
