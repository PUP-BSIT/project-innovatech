<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

try {
    $sql = "SELECT cr.user_id, cr.recipe_id, cr.caption, cr.image, cr.shared_at, up.username, up.profile_picture 
            FROM community_recipes cr 
            JOIN user_profiles up ON cr.user_id = up.user_id 
            ORDER BY cr.shared_at DESC";
    $result = $conn->query($sql);

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $userAvatar = !empty($row['profile_picture']) ? 'data:image/jpeg;base64,' . base64_encode($row['profile_picture']) : 'assets/images/default-avatar.png';

        $posts[] = [
            'userId' => $row['user_id'],
            'recipeId' => $row['recipe_id'],
            'username' => $row['username'],
            'time' => $row['shared_at'],
            'userAvatar' => $userAvatar,
            'image' => $row['image'] ? 'data:image/jpeg;base64,' . base64_encode($row['image']) : '',
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
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

$conn->close();

echo json_encode($response);
?>
