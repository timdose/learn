<?php
header('Content-Type: application/json');

try {
    // Validate input
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['email'])) {
        throw new Exception('Missing required fields');
    }

    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    $requestId = htmlspecialchars($input['requestId'] ?? '', ENT_QUOTES, 'UTF-8');
    $courseName = htmlspecialchars($input['courseName'] ?? '', ENT_QUOTES, 'UTF-8');
    // Make timePreferences optional with empty array as default
    $timePreferences = isset($input['timePreferences']) ? (
        is_array($input['timePreferences']) 
            ? array_map('htmlspecialchars', $input['timePreferences'])
            : [htmlspecialchars($input['timePreferences'])]
    ) : [];
    $otherTimes = isset($input['otherTimes']) ? htmlspecialchars($input['otherTimes']) : '';

    // Prepare email content
    $message = "Email: $email\n";
    if (!empty($timePreferences)) {
        $message .= "Preferred Times:\n - " . implode("\n - ", array_map(function($time) {
            return trim($time);
        }, $timePreferences)) . "\n";
    }
    if ($otherTimes) {
        $message .= "Other Times: $otherTimes\n";
    }
    
    $to = 'timdose@gmail.com';
    $subject = "New Waitlist Submission: $courseName - $requestId";
    $headers = [
        'From' => 'waitlist@timdoseart.com',
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Thank you! Your time preference has been recorded.']);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
