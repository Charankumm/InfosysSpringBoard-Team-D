import joblib
import pandas as pd
import os

# Get backend folder path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load models
machine_failure_model = joblib.load(
    os.path.join(BASE_DIR, "models", "machine_failure_model.pkl")
)

failure_type_model = joblib.load(
    os.path.join(BASE_DIR, "models", "failure_type_model.pkl")
)

label_encoder = joblib.load(
    os.path.join(BASE_DIR, "models", "label_encoder.pkl")
)


def get_warning_status(prob):
    if prob < 0.30:
        return "Green - Healthy"
    elif prob < 0.60:
        return "Yellow - Monitor"
    elif prob < 0.80:
        return "Orange - Warning"
    else:
        return "Red - Critical"


def predict_machine(data):

    # Convert JSON into DataFrame
    df = pd.DataFrame([data])

    # ---------------------------
    # Model 1
    # ---------------------------
    prediction = machine_failure_model.predict(df)[0]

    probability = machine_failure_model.predict_proba(df)[0][1]

    result = {
        "machine_failure": bool(prediction),
        "failure_probability": round(float(probability), 4),
        "failure_type": None,
        "alert": get_warning_status(probability)
    }

    # ---------------------------
    # Model 2
    # ---------------------------
    if prediction == 1:

        failure = failure_type_model.predict(df)[0]

        failure_name = label_encoder.inverse_transform([failure])[0]

        result["failure_type"] = failure_name

    return result