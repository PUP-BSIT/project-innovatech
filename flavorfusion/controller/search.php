<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

include_once 'db_connection.php';

$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$mealType = isset($_GET['mealType']) ? $_GET['mealType'] : '';
$dietaryPref = isset($_GET['dietaryPref']) ? $_GET['dietaryPref'] : '';
$ingredient = isset($_GET['ingredient']) ? $_GET['ingredient'] : '';

$sql = "
    SELECT 
        r.recipe_id, 
        r.name, 
        r.picture AS image, 
        COALESCE(AVG(rt.rating), 0) AS rating,
        r.created_at
    FROM 
        recipes r
    LEFT JOIN recipe_meal_types mt ON r.recipe_id = mt.recipe_id
    LEFT JOIN recipe_dietary_prefs dp ON r.recipe_id = dp.recipe_id
    LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
    LEFT JOIN ratings rt ON r.recipe_id = rt.recipe_id
";

$params = array();
$types = '';
$whereClauses = array("1 = 1");

if (!empty($keyword)) {
    $whereClauses[] = "r.name LIKE ?";
    $params[] = "%" . $keyword . "%";
    $types .= 's';
}

if (!empty($mealType)) {
    $whereClauses[] = "mt.meal_type = ?";
    $params[] = $mealType;
    $types .= 's';
}

if (!empty($dietaryPref)) {
    $whereClauses[] = "dp.dietary_pref = ?";
    $params[] = $dietaryPref;
    $types .= 's';
}

if (!empty($ingredient)) {
    $ingredients = explode(',', $ingredient);
    foreach ($ingredients as $ing) {
        $whereClauses[] = "EXISTS (
            SELECT 1 FROM recipe_ingredients ri2 
            WHERE ri2.recipe_id = r.recipe_id 
            AND ri2.ingredient LIKE ?
        )";
        $params[] = "%" . trim($ing) . "%";
        $types .= 's';
    }
}

$sql .= " WHERE " . implode(" AND ", $whereClauses);
$sql .= " GROUP BY r.recipe_id";
$sql .= " ORDER BY r.created_at DESC"; // Added ORDER BY clause to sort by creation date

$stmt = $conn->prepare($sql);
if ($stmt) {
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $recipes = array();
    while ($row = $result->fetch_assoc()) {
        $row['image'] = base64_encode($row['image']);
        $recipes[] = array(
            "recipe_id" => $row["recipe_id"],
            "name" => $row["name"],
            "image" => $row["image"],
            "rating" => $row["rating"]
        );
    }

    $stmt->close();
    echo json_encode($recipes);
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Internal server error"));
}

$conn->close();
?>