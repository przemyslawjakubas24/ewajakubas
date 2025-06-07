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
$email_content = "Imię i nazwisko: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Telefon: $phone\n";
$email_content .= "Rodzaj wydarzenia: $event\n";
$email_content .= "Data wydarzenia: $date\n\n";
$email_content .= "Wiadomość:\n$message\n";

// Utwórz instancję; przekazanie `true` włącza wyjątki
$mail = new PHPMailer(true);

try {
    // Ustawienia serwera
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Wyłącz szczegółowe informacje debugowania (ustaw DEBUG_SERVER dla debugowania)
    $mail->isSMTP();                                         // Wyślij używając SMTP
    $mail->Host       = 'h58.seohost.pl';                  // Ustaw serwer SMTP do wysyłania (zmień na swój)
    $mail->SMTPAuth   = true;                                // Włącz uwierzytelnianie SMTP\\
    $mail->Username   = 'form@testystrony.pl';                  // Nazwa użytkownika SMTP (zmień na swoją)
    $mail->Password   = 'Tmobile1';                            // Hasło SMTP (zmień na swoje) CZY TO HASŁO JEST PRAWIDŁOWE?
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Włącz domyślne szyfrowanie TLS
    $mail->Port       = 465;                                 // Port TCP do połączenia; użyj 587 jeśli ustawiłeś `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    $mail->CharSet    = 'UTF-8';                             // Ustaw kodowanie znaków na UTF-8 dla polskich znaków

    // Odbiorcy
    $mail->setFrom('jakubas.tbg@gmail.com', 'Formularz kontaktowy');  // Od kogo (adres formularza)
    $mail->addAddress('form@testystrony.pl');                       // Dodaj odbiorcę (zmień na swój)
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