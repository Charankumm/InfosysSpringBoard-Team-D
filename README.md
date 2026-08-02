# 🏭 AI-Powered Predictive Maintenance System with Real-Time Monitoring

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Backend-lightgrey.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange.svg)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Model-success.svg)](https://xgboost.readthedocs.io/)

---

# 📖 Overview

The **AI-Powered Predictive Maintenance System** is a machine learning and web-based application that predicts industrial machine failures before they occur using sensor data.

The system consists of two AI models:

- **Model 1:** Predicts whether a machine will fail or not.
- **Model 2:** Identifies the type of failure if a failure is predicted.

The application provides real-time failure prediction through a Flask REST API and a React frontend.

---

# ✨ Features

- Predict machine failure using Machine Learning
- Predict failure type
- Real-time prediction through Flask API
- React frontend for user interaction
- Trained using AI4I 2020 Predictive Maintenance Dataset
- Automatic preprocessing using Scikit-Learn Pipeline
- Supports Random Forest, Gradient Boosting and XGBoost
- Displays failure probability
- Warning Status:
  - 🟢 Healthy
  - 🟡 Monitor
  - 🟠 Warning
  - 🔴 Critical

---

# 🛠 Technology Stack

## Machine Learning

- Python
- Pandas
- NumPy
- Scikit-Learn
- XGBoost
- Joblib

## Backend

- Flask
- Flask-CORS

## Frontend

- React
- JavaScript
- HTML
- CSS

---

# 📂 Project Structure

```text
Machine_Failure_detection/
│
├── backend/
│   │
│   ├── flask_application/
│   │   ├── app.py
│   │   ├── routes.py
│   │   └── utils.py
│   │
│   ├── models/
│   │   ├── machine_failure_model.pkl
│   │   ├── failure_type_model.pkl
│   │   └── label_encoder.pkl
│   │
│   ├── model_tranning/
│   │   ├── ai4i2020.csv
│   │   └── machine_failure_prediction.ipynb
│   │
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/SweetyPaul19/InfosysSpringBoard-Team-D.git

cd Machine_Failure_detection
```

---

## 2. Create Virtual Environment

Windows

```bash
python -m venv venv
```

Activate

```bash
venv\Scripts\activate
```

---

## 3. Install Backend Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

## 4. Run Flask Backend

```bash
cd flask_application

python app.py
```

Backend runs at

```
http://127.0.0.1:5000
```

---

## 5. Run React Frontend

```bash
cd frontend

npm install

npm start
```

or

```bash
npm run dev
```

depending on your React setup.

---

# 🤖 Machine Learning Workflow

1. Load Dataset
2. Data Cleaning
3. Feature Engineering
4. Train-Test Split
5. Model Training
   - Random Forest
   - Gradient Boosting
   - XGBoost
6. Model Evaluation
7. Save Best Models
8. Deploy using Flask API

---

# 📊 Model Outputs

## Model 1

Predicts

- Machine Failure
- No Machine Failure

Evaluation Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

---

## Model 2

Predicts Failure Type

- Heat Dissipation Failure (HDF)
- Power Failure (PWF)
- Overstrain Failure (OSF)
- Tool Wear Failure (TWF)
- Random Failure (RNF)

---

# 📡 API Endpoint

### POST

```
/predict
```

Input JSON

```json
{
  "Type": "L",
  "Air temperature [K]": 298.1,
  "Process temperature [K]": 308.6,
  "Rotational speed [rpm]": 1551,
  "Torque [Nm]": 42.8,
  "Tool wear [min]": 10
}
```

Output

```json
{
  "machine_failure": 0,
  "failure_probability": 0.12,
  "status": "Healthy"
}
```

---

# 📈 Dataset

**AI4I 2020 Predictive Maintenance Dataset**

Features

- Type
- Air Temperature
- Process Temperature
- Rotational Speed
- Torque
- Tool Wear

Target

- Machine Failure
- Failure Type

---


- Docker Support
- Predict Remaining Useful Life (RUL)
- Model Monitoring
