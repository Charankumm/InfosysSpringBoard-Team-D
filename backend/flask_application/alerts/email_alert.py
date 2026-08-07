import smtplib
from email.message import EmailMessage
from .config import SENDER_EMAIL, APP_PASSWORD, RECEIVER_EMAIL


def send_email_alert(subject, message):
    email = EmailMessage()
    email["Subject"] = subject
    email["From"] = SENDER_EMAIL
    email["To"] = RECEIVER_EMAIL
    email.set_content(message)

    try:
        # Added timeout=10 seconds
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as smtp:
            smtp.login(SENDER_EMAIL, APP_PASSWORD)
            smtp.send_message(email)

        print("✅ Email alert sent successfully!")
        return True

    except Exception as e:
        print("❌ Failed to send email:", e)
        return False


if __name__ == "__main__":
    send_email_alert(
        "Test Alert",
        "This is a test email from the Predictive Maintenance Alert System."
    )