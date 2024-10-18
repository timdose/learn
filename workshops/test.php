<?php
$to = "timdose@gmail.com";
$subject = "Dreamhost email test";

// compose headers
$headers = "From: tim@timdoseart.com\r\n";
$headers .= "Reply-To: tim@timdoseart.com\r\n";
$headers .= "X-Mailer: PHP/".phpversion();

// compose message
$message = " Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
$message .= " Nam iaculis pede ac quam. Etiam placerat suscipit nulla.";
$message .= " Maecenas id mauris eget tortor facilisis egestas.";
$message .= " Praesent ac augue sed enim aliquam auctor. Ut dignissim ultricies est.";
$message .= " Pellentesque convallis tempor tortor. Nullam nec purus.";
$message = wordwrap($message, 70);

// send email
mail($to, $subject, $message, $headers);
?>



<?php
// // Import PHPMailer classes into the global namespace
// // These must be at the top of your script, not inside a function
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require '/home/dh_uasa28/PHPMailer/src/Exception.php';
// require '/home/dh_uasa28/PHPMailer/src/PHPMailer.php';
// require '/home/dh_uasa28/PHPMailer/src/SMTP.php';

// $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
// try {
//     //Server settings
//     $mail->SMTPDebug = 2;                                 // Enable verbose debug output
//     $mail->isSMTP();                                      // Set mailer to use SMTP
//     $mail->Host = 'smtp.dreamhost.com';                  // Specify main and backup SMTP servers
//     $mail->SMTPAuth = true;                               // Enable SMTP authentication
//     $mail->Username = 'dh_uasa28@http://iad1-shared-e1-13.dreamhost.com';             // SMTP username
//     $mail->Password = 'secret';                           // SMTP password
//     $mail->SMTPSecure = 'ssl';                            // Enable SSL encryption, TLS also accepted with port 465
//     $mail->Port = 465;                                    // TCP port to connect to

//     //Recipients
//     $mail->setFrom('tim@timdoseart.com', 'Tim Dosé');          //This is the email your form sends From
//     $mail->addAddress('timdose@dgmail.com', 'Tim Dosé'); // Add a recipient address
//     //$mail->addAddress('contact@example.com');               // Name is optional
//     //$mail->addReplyTo('info@example.com', 'Information');
//     //$mail->addCC('cc@example.com');
//     //$mail->addBCC('bcc@example.com');

//     //Attachments
//     //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//     //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

//     //Content
//     $mail->isHTML(true);                                  // Set email format to HTML
//     $mail->Subject = 'Test email from dreamhost';
//     $mail->Body    = 'Testing today\'s date: ' . date('Y-m-d') . ' and time: ' . date('H:i:s');
//     //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

//     $mail->send();
//     echo 'Message has been sent';
// } catch (Exception $e) {
//     echo 'Message could not be sent.';
//     echo 'Mailer Error: ' . $mail->ErrorInfo;
// }
?>