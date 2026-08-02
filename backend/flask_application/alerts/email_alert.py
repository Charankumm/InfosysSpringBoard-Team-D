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
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, APP_PASSWORD)
            smtp.send_message(email)
            print("✅ Email alert sent successfully!")

    except Exception as e:
        print("❌ Failed to send email:", e)


if __name__ == "__main__":
    send_email_alert(
        "Test Alert",
        "This is a test email from the Predictive Maintenance Alert System."
    )