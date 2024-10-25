<?php
// Error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form data
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $itemName = filter_var($_POST['itemName'], FILTER_SANITIZE_STRING);
    $price = filter_var($_POST['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $originalPrice = filter_var($_POST['originalPrice'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $discount = filter_var($_POST['discount'], FILTER_SANITIZE_NUMBER_INT);
    $courseName = filter_var($_POST['courseName'], FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email address"]);
        exit;
    }

    // Send email
    $result = sendEmailNotification($email, $itemName, $price, $originalPrice, $discount);

    if ($result) {
        http_response_code(200);
        echo json_encode(["message" => "Successfully added to waitlist"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to process request"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}

function sendEmailNotification($email, $itemName, $price, $originalPrice, $discount) {
    $to = "timdose@gmail.com";
    $subject = "New Waitlist Submission for " . $courseName;
    
    $message = "New waitlist submission:\n\n";
    $message .= "Email: $email\n";
    $message .= "Item: $itemName\n";
    $message .= "Price: $price\n";
    $message .= "Original Price: $originalPrice\n";
    $message .= "Discount: $discount%\n";

    $headers = "From: tim@timdoseart.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $message, $headers);
}
?>