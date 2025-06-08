<?php
// Importuj klasy PHPMailer do globalnej przestrzeni nazw
// Te deklaracje muszą znajdować się na początku skryptu, nie wewnątrz funkcji
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Ścieżka do biblioteki PHPMailer (zmień ścieżkę jeśli jest inna)
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// Odbierz dane z formularza
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$event = $_POST['event'] ?? '';
$date = $_POST['date'] ?? '';
$message = $_POST['message'] ?? '';

// Treść wiadomości
$email_content = "Imię: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Telefon: $phone\n";
$email_content .= "Rodzaj wydarzenia: $event\n";
$email_content .= "Data wydarzenia: $date\n\n";
$email_content .= "Wiadomość:\n$message\n";

// Utwórz instancję; przekazanie `true` włącza wyjątki
$mail = new PHPMailer(true);

try {
    // Ustawienia serwera
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = 'h58.seohost.pl';
    $mail->SMTPAuth   = true;    
    $mail->Username   = 'form@testystrony.pl';           
    $mail->Password   = 'Tmobile1';                   
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;                               
    $mail->CharSet    = 'UTF-8';

    // Odbiorcy
    $mail->setFrom('form@testystrony.pl', 'Formularz kontaktowy');  // Od kogo (adres formularza)
    $mail->addAddress('kontakt@testystrony.pl');                       // Dodaj odbiorcę (zmień na swój)
    $mail->addReplyTo($email, $name);                                 // Adres zwrotny (adres osoby wypełniającej)

    // Treść
    $mail->isHTML(false);                                    // Format wiadomości jako tekst (false = tekst, true = HTML)
    $mail->Subject = 'Nowa wiadomość ze strony testystrony.pl';
    $mail->Body    = $email_content;

    $mail->send();
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Nie udało się wysłać wiadomości: {$mail->ErrorInfo}"]);
}
?>