<?php
session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Credentials: true');

require_once 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['recipe_id'])) {
    echo json_encode(['error' => 'Recipe ID not provided']);
    exit;
}

$recipe_id = $data['recipe_id'];

$query = "DELETE FROM recipes WHERE recipe_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $recipe_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => 'Recipe deleted successfully']);
} else {
    echo json_encode(['error' => 'Failed to delete recipe']);
}

$stmt->close();
$conn->close();
?>