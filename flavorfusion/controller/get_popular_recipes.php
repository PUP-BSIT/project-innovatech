<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

$sql = "SELECT r.recipe_id, r.name, r.picture
        FROM recipes r
        LEFT JOIN saved_recipes sr ON r.recipe_id = sr.recipe_id
        LEFT JOIN ratings rt ON r.recipe_id = rt.recipe_id
        GROUP BY r.recipe_id
        ORDER BY COUNT(sr.saved_recipe_id) + COUNT(rt.rating_id) DESC
        LIMIT 8";

$result = $conn->query($sql);

$recipes = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['picture'] = base64_encode($row['picture']);
        $recipes[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($recipes);

$conn->close();
?>