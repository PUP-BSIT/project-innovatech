<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

function getRandomRecipeForMeal($mealType, $conn) {
    $sql = "SELECT r.recipe_id, r.name AS title, r.description, r.time, 
                   r.servings, r.picture
            FROM recipes r
            INNER JOIN recipe_meal_types rm ON r.recipe_id = rm.recipe_id
            WHERE rm.meal_type = ?
            ORDER BY RAND()
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $mealType);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $row['image'] = base64_encode($row['picture']);
        unset($row['picture']); 
        return $row;
    } else {
        return null;
    }
}

$meals = [
    'Breakfast' => getRandomRecipeForMeal('Breakfast', $conn),
    'Lunch' => getRandomRecipeForMeal('Lunch', $conn),
    'Dinner' => getRandomRecipeForMeal('Dinner', $conn)
];

$conn->close();

header('Content-Type: application/json');
echo json_encode($meals);
?>