<?php
header('Content-Type: application/json');

try {
    // Validate input
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['email']) || !isset($input['timePreferences'])) {
        throw new Exception('Missing required fields');
    }

    $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
    // Handle timePreference as an array
    $timePreference = is_array($input['timePreferences']) 
        ? array_map('htmlspecialchars', $input['timePreferences'])
        : [htmlspecialchars($input['timePreferences'])];
    $otherTimes = isset($input['otherTimes']) ? htmlspecialchars($input['otherTimes']) : '';

    // Prepare email content
    $to = 'timdose@gmail.com';
    $subject = 'New Workshop Time Preference Submission';
    $message = "Email: $email\n";
    $message .= "Preferred Times: " . implode(", ", $timePreference) . "\n";
    if ($otherTimes) {
        $message .= "Other Times: $otherTimes\n";
    }
    
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
