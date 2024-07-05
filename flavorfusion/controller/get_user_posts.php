<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once 'db_connection.php';


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$userId = $_GET['user_id'];
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$pageSize = isset($_GET['pageSize']) ? (int) $_GET['pageSize'] : 3;
$offset = ($page - 1) * $pageSize;

$sql = "SELECT COUNT(*) as total FROM community_recipes WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$total = $result->fetch_assoc()['total'];

$sql = "SELECT * FROM community_recipes WHERE user_id = ? LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $userId, $offset, $pageSize);
$stmt->execute();
$result = $stmt->get_result();

$posts = array();
while ($row = $result->fetch_assoc()) {
    $row['image'] = base64_encode($row['image']);
    $posts[] = $row;
}

$response = [
    'total' => $total,
    'page' => $page,
    'pageSize' => $pageSize,
    'posts' => $posts
];

echo json_encode($response);

$stmt->close();
$conn->close();
?>