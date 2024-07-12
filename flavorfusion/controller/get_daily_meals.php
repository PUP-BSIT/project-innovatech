<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

date_default_timezone_set('Asia/Manila');

$date = date('Y-m-d');

$sql = "DELETE FROM daily_meals WHERE date < ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $date);
$stmt->execute();

$sql = "SELECT dm.meal_type, r.recipe_id, r.name AS title, r.description, 
               r.time, r.servings, r.picture
        FROM daily_meals dm
        INNER JOIN recipes r ON dm.recipe_id = r.recipe_id
        WHERE dm.date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $date);
$stmt->execute();
$result = $stmt->get_result();

$meals = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['image'] = base64_encode($row['picture']);
        unset($row['picture']); 
        $meals[$row['meal_type']] = $row;
    }
} else {
    $mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    foreach ($mealTypes as $mealType) {
        $meals[$mealType] = getRandomRecipeForMeal($mealType, $conn);
        if ($meals[$mealType]) {
            $sql = "INSERT INTO daily_meals (meal_type, recipe_id, date) 
                    VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('sis', $mealType, 
                              $meals[$mealType]['recipe_id'], $date);
            $stmt->execute();
        }
    }
}

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

$conn->close();

header('Content-Type: application/json');
echo json_encode($meals);
?>