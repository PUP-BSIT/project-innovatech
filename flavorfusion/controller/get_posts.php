<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

try {
    $sql = "SELECT user_id, recipe_id, caption, image, shared_at FROM 
    community_recipes ORDER BY shared_at DESC";
    $result = $conn->query($sql);

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = [
            'userId' => $row['user_id'],
            'recipeId' => $row['recipe_id'],
            'username' => 'current_user',
            'time' => $row['shared_at'],
            'userAvatar' => 'assets/images/default-avatar.png',
            'image' => $row['image'] ? 'data:image/jpeg;base64,'
                . base64_encode($row['image']) : '',
            'description' => $row['caption'],
            'likes' => 0,
            'liked' => false,
            'comments' => [],
            'caption' => $row['caption']
        ];
    }

    $response = ['success' => true, 'posts' => $posts];
} catch (mysqli_sql_exception $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: '
            . $e->getMessage()
    ];
}

$conn->close();

echo json_encode($response);
?>