from .email_alert import send_email_alert


def process_prediction(
    failure_detected,
    failure_type=None,
    probability=0,
    status=""
):

    if not failure_detected:
        return

    subject = "⚠ Predictive Maintenance Alert"

    message = f"""
Machine Failure Predicted!

Alert Level: {status}

Failure Probability: {probability:.2%}

Failure Type: {failure_type}

Please inspect the machine immediately.
"""

    send_email_alert(subject, message)