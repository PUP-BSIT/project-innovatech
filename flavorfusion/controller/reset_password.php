<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

include('db_connection.php');

$response = ["error" => "", "message" => ""];

try {
    $input = json_decode(file_get_contents('php://input'), true);

    // Debug: Log received input
    error_log("Received input: " . json_encode($input));

    if (!isset($input["key"]) || !isset($input["email"]) || 
            !isset($input["password"])) {
        throw new Exception("Missing required parameters");
    }

    $token = mysqli_real_escape_string($conn, $input["key"]);
    $email = mysqli_real_escape_string($conn, $input["email"]);
    $password = password_hash($input["password"], PASSWORD_DEFAULT);
    $curDate = date("Y-m-d H:i:s");

    // Fetch the latest entry for the given email
    $query = mysqli_query($conn, "SELECT * FROM `password_reset_temp` 
            WHERE `email`='$email' ORDER BY `expDate` DESC LIMIT 1");
    if (mysqli_num_rows($query) == 0) {
        throw new Exception("Invalid Link");
    }

    $row = mysqli_fetch_assoc($query);
    if ($row['key'] !== $token) {
        throw new Exception("Invalid Link");
    }

    $expDate = $row['expDate'];
    if ($expDate >= $curDate) {
        // Update password in the users table
        if (mysqli_query($conn, "UPDATE `users` SET `password_hash`='$password' 
                WHERE `email`='$email'")) {

                // Delete the password reset token
                mysqli_query($conn, "DELETE FROM `password_reset_temp` 
                        WHERE `email`='$email'");
                $response["message"] = 
                        "Password has been updated successfully in both tables";
            
        } else {
            throw new Exception("Failed to update password in users table");
        }
    } else {
        throw new Exception("Link Expired");
    }
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
?>
