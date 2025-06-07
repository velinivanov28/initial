<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name    = strip_tags(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    $captcha = $_POST["g-recaptcha-response"] ?? '';

    if (!$name || !$email || !$message || !$captcha || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: contact.html?msg=" . urlencode("Моля, попълнете всички полета правилно."));
        exit;
    }

    // Validate reCAPTCHA with Google
    $secretKey = "6LfnklgrAAAAALTdNdcY90gGWnsHzfuN1dxUpOPE";
    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$captcha}"
    );
    $result = json_decode($response, true);

    if (!isset($result["success"]) || $result["success"] !== true) {
        header("Location: contact.html?msg=" . urlencode("reCAPTCHA не беше успешно. Моля, опитайте отново."));
        exit;
    }

    // Send email
    $to = "veil_side28@abv.bg";
    $subject = "Съобщение от уебсайта";
    $body = "Име: $name\nИмейл: $email\n\nСъобщение:\n$message";
    $headers = "From: $name <$email>";

    if (mail($to, $subject, $body, $headers)) {
        header("Location: contact.html?msg=" . urlencode("Съобщението беше изпратено успешно."));
    } else {
        header("Location: contact.html?msg=" . urlencode("Възникна грешка при изпращането."));
    }
    exit;
} else {
    header("Location: contact.html");
    exit;
}
