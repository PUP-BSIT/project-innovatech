<?php
include_once 'db_connection.php';

header("Content-Type: application/json; charset=UTF-8");

$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$mealType = isset($_GET['mealType']) ? $_GET['mealType'] : '';
$dietaryPref = isset($_GET['dietaryPref']) ? $_GET['dietaryPref'] : '';
$ingredient = isset($_GET['ingredient']) ? $_GET['ingredient'] : '';

$sql = "SELECT DISTINCT r.* FROM recipes r";
$params = array();

$sql .= " LEFT JOIN recipe_meal_types mt ON r.recipe_id = mt.recipe_id";
$sql .= " LEFT JOIN recipe_dietary_prefs dp ON r.recipe_id = dp.recipe_id";
$sql .= " LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id";

$sql .= " WHERE 1 = 1";

if (!empty($keyword)) {
    $sql .= " AND r.name LIKE ?";
    $params[] = "%" . $keyword . "%";
}

if (!empty($mealType)) {
    $sql .= " AND mt.meal_type = ?";
    $params[] = $mealType;
}

if (!empty($dietaryPref)) {
    $sql .= " AND dp.dietary_pref = ?";
    $params[] = $dietaryPref;
}

if (!empty($ingredient)) {
    $sql .= " AND ri.ingredient LIKE ?";
    $params[] = "%" . $ingredient . "%";
}

$stmt = $conn->prepare($sql);
if ($stmt) {
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    
    $result = $stmt->get_result();

    $recipes = array();
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }

    $stmt->close();

    echo json_encode($recipes);
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Internal server error"));
}

$conn->close();

?>