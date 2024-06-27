<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';
//TODO: fix timeAgo function bug some comment.time remain as "just now"

function timeAgo($time) {
    $time = strtotime($time);
    $diff = time() - $time;

    if ($diff < 60) {
        return 'just now';
    } if ($diff < 3600) {
        return ceil($diff / 60) . ' minutes ago';
    } elseif ($diff < 86400) {
        return ceil($diff / 3600) . ' hours ago';
    } elseif ($diff < 2592000) {
        return ceil($diff / 86400) . ' days ago';
    } elseif ($diff < 31536000) {
        return ceil($diff / 2592000) . ' months ago';
    } else {
        return ceil($diff / 31536000) . ' years ago';
    }
}

try {
    $sql = "SELECT cr.community_recipe_id, cr.user_id, cr.caption, cr.image, 
            cr.shared_at, up.username, up.profile_picture 
            FROM community_recipes cr 
            JOIN user_profiles up ON cr.user_id = up.user_id 
            ORDER BY cr.shared_at DESC";
    $result = $conn->query($sql);

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $postId = $row['community_recipe_id'];
        $userAvatar = !empty($row['profile_picture']) ? 'data:image/jpeg;base64,' 
                . base64_encode($row['profile_picture']) : 
                'assets/images/default-avatar.png';

        $comments = [];
        // Use a prepared statement to fetch comments
        $stmt = $conn->prepare("SELECT c.comment_id, c.comment, c.commented_at, 
                up.username, up.profile_picture 
                                FROM comments c 
                                JOIN user_profiles up ON c.user_id = up.user_id 
                                WHERE c.community_recipe_id = ? 
                                ORDER BY c.commented_at DESC");
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $commentResult = $stmt->get_result();
        while ($commentRow = $commentResult->fetch_assoc()) {
            $commentAvatar = !empty($commentRow['profile_picture']) ? 
                    'data:image/jpeg;base64,' 
                    . base64_encode($commentRow['profile_picture']) : 
                    'assets/images/default-avatar.png';

            $comments[] = [
                'commentId' => $commentRow['comment_id'],
                'username' => $commentRow['username'],
                'userAvatar' => $commentAvatar,
                'time' => timeAgo($commentRow['commented_at']), 
                'text' => $commentRow['comment']
            ];
        }
        $stmt->close();

        $posts[] = [
            'userId' => $row['user_id'],
            'communityRecipeId' => $postId,
            'username' => $row['username'],
            'time' => timeAgo($row['shared_at']), //TODO: fix comment time
            'userAvatar' => $userAvatar,
            'image' => $row['image'] ? 'data:image/jpeg;base64,' 
                    . base64_encode($row['image']) : '',
            'description' => $row['caption'],
            'likes' => 0,
            'liked' => false,
            'comments' => $comments,
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
