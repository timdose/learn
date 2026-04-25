<?php
// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Set the content type to JSON
header('Content-Type: application/json');

// Log errors to a file instead of displaying them
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

try {
    // Check if the request method is POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Retrieve and sanitize form data
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $courseName = htmlspecialchars($_POST['courseName'] ?? '', ENT_QUOTES, 'UTF-8');
        $itemName = htmlspecialchars($_POST['itemName'] ?? '', ENT_QUOTES, 'UTF-8');
        $price = filter_var($_POST['price'] ?? '', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $originalPrice = filter_var($_POST['originalPrice'] ?? '', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $discount = filter_var($_POST['discount'] ?? '', FILTER_SANITIZE_NUMBER_INT);
        $requestId = htmlspecialchars($_POST['requestId'] ?? '', ENT_QUOTES, 'UTF-8');

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email address");
        }

        // Send email
        $to = "timdose@gmail.com";
        $subject = "New Waitlist Submission: $courseName - $requestId";
        $message = "New waitlist submission:\n\n";
        $message .= "Email: $email\n";
        $message .= "Course: $courseName\n";
        $message .= "Item: $itemName\n";
        $message .= "Price: $price\n";

        // Only add original price and discount if price is different from original price
        if ($price != $originalPrice) {
            $message .= "Original Price: $originalPrice\n";
            $message .= "Discount: $discount%\n";
        }

        $headers = "From: waitlist@timdoseart.com\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["message" => "Successfully added to waitlist"]);
        } else {
            throw new Exception("Failed to send email");
        }
    } else {
        throw new Exception("Invalid request method");
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
