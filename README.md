# 🚀 Machine Learning System for Early Detection of Equipment Failure

> **Predict. Prevent. Perform.**

An AI-driven predictive maintenance system that uses Machine Learning, Industrial IoT concepts, and real-time monitoring to predict equipment failures before they occur. The system helps enable proactive maintenance and reduce operational downtime.

---

## 📌 Project Overview

Traditional maintenance approaches either wait for equipment failures or follow fixed maintenance schedules. This can lead to increased downtime, unnecessary maintenance costs, and reduced equipment lifespan.

This project uses machine sensor data and Machine Learning models to predict potential equipment failures. The system includes a web-based dashboard for entering machine parameters, viewing prediction results, monitoring machine health, and generating maintenance alerts.

---

## 🎯 Objectives

* Predict machine failures before they occur
* Reduce unplanned downtime
* Support proactive maintenance decisions
* Improve equipment reliability
* Enable real-time prediction and monitoring
* Improve operational efficiency

---

## ⚙️ Features

* 🤖 Machine Learning-based failure prediction
* 📊 Interactive web dashboard
* 📈 Failure probability visualization
* 🚨 Machine health status monitoring
* 🔔 Automated email alerts
* 📋 Prediction history tracking
* 💡 Maintenance recommendations
* 📄 Downloadable maintenance reports
* 📡 MQTT-based communication support

---

## 🏗️ System Architecture

```text
Machine / Sensor Data
        │
        ▼
 Data Collection & Input
        │
        ▼
   Flask Backend
        │
        ├── Machine Learning Model
        │
        ├── MQTT Communication
        │
        └── Email Alert System
        │
        ▼
 Prediction Results
        │
        ▼
 Interactive Dashboard
```

The system follows a modular architecture where the frontend communicates with the Flask backend. The backend processes machine parameters, uses trained Machine Learning models for prediction, and triggers alerts when necessary.

---

## 🖥️ Dashboard Highlights

The PredictIQ dashboard provides an interface for monitoring machine health and maintenance insights.

It includes:

* Machine parameter input
* Machine failure prediction
* Machine health status
* Failure probability visualization
* Prediction history
* Maintenance recommendations
* Email alert notifications

---

## 🛠️ Tech Stack

### Backend

* Python
* Flask

### Machine Learning

* Scikit-learn
* Machine Learning classification models

### Data Processing

* Pandas
* NumPy

### Communication

* MQTT
* SMTP Email Alerts

### Frontend

* HTML5
* CSS3
* JavaScript

### Development Tools

* Jupyter Notebook
* Git
* GitHub

---

## 📂 Dataset

The project uses the **AI4I 2020 Predictive Maintenance Dataset** for training and evaluating the machine failure prediction model.

The dataset contains machine operating parameters such as:

* Air temperature
* Process temperature
* Rotational speed
* Torque
* Tool wear

It also includes machine failure information used for predictive maintenance analysis.

---

## 🤖 Machine Learning Pipeline

1. Data Collection
2. Data Cleaning
3. Exploratory Data Analysis
4. Feature Engineering
5. Model Training
6. Machine Failure Prediction
7. Failure Type Classification
8. Model Evaluation
9. Real-Time Prediction

---

## 📊 Expected Benefits

* Reduce unexpected equipment failures
* Support proactive maintenance
* Improve operational efficiency
* Reduce maintenance costs
* Improve equipment reliability
* Enable data-driven maintenance decisions

---

## 📁 Repository Structure

```text
InfosysSpringBoard-Team-D/
│
├── Project/
│   │
│   ├── backend/
│   │   ├── .gitignore
│   │   ├── flask_application/
│   │   │   ├── alerts/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── alert_manager.py
│   │   │   │   ├── config.py
│   │   │   │   └── email_alert.py
│   │   │   │
│   │   │   ├── mqtt/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── publisher.py
│   │   │   │   └── subscriber.py
│   │   │   │
│   │   │   ├── app.py
│   │   │   ├── routes.py
│   │   │   └── utils.py
│   │   │
│   │   ├── model_tranning/
│   │   │   ├── ai4i2020.csv
│   │   │   └── machine_failure_predicion.ipynb
│   │   │
│   │   └── requirements.txt
│   │
│   ├── datasets/
│   │   └── predictive_maintenance.csv
│   │
│   ├── frontend/
│   │   ├── assets/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   │
│   ├── images/
│   │   ├── correlation_heatmap.png
│   │   ├── failure_distribution.png
│   │   └── torque_distribution.png
│   │
│   └── notebooks/
│       └── 01_Data_cleaning_and_EDA.ipynb
│
├── Documentation/
│   │
│   ├── milestone ppt/
│   │   ├── 1/
│   │   │   └── Predictive_Maintenance_1.pptx
│   │   ├── 2/
│   │   │   └── Predictive Maintenance in Industry 2.pptx
│   │   ├── 3/
│   │   │   └── PredictIQ_Presentation_3.pptx
│   │   └── 4/
│   │       └── PredictIQ_Presentation_4.pptx
│   │
│   └── Video/
│       └── Project demo video.mp4
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Charankumm/InfosysSpringBoard-Team-D.git
```

### 2. Navigate to the Repository

```bash
cd InfosysSpringBoard-Team-D
```

### 3. Install Dependencies

```bash
cd Project/backend
pip install -r requirements.txt
```

### 4. Run the Application

```bash
cd flask_application
python app.py
```

Alternatively, from the repository root:

```bash
python Project/backend/flask_application/app.py
```

---

## 🔄 Project Workflow

1. The user enters machine operating parameters through the web dashboard.
2. The frontend sends the input data to the Flask backend.
3. The backend processes the data.
4. The Machine Learning model predicts the probability of machine failure.
5. Prediction results are displayed on the dashboard.
6. If a critical condition is detected, the system can trigger an automated email alert.
7. MQTT can be used for machine or sensor communication.
8. Users can review machine health information and prediction results.

---

## 📓 Exploratory Data Analysis

The project includes Exploratory Data Analysis and data preprocessing notebooks for understanding machine conditions and failure patterns.

The analysis includes:

* Dataset exploration
* Missing value analysis
* Feature distribution analysis
* Machine failure distribution
* Correlation analysis
* Feature preprocessing

The generated visualizations are available in the `Project/images/` directory.

---

## 📚 Documentation

Project-related resources are organized separately from the source code.

```text
Documentation/
├── milestone ppt/
│   ├── 1/
│   ├── 2/
│   ├── 3/
│   └── 4/
│
└── Video/
    └── Project demo video.mp4
```

---

## 🌱 Future Enhancements

* Real-time IoT sensor integration
* Cloud deployment
* Advanced anomaly detection
* Remaining Useful Life prediction
* Digital Twin integration
* Edge AI deployment
* Mobile monitoring application
* Continuous model retraining

---

## 🎥 Demo

The application demonstrates an end-to-end predictive maintenance workflow:

```text
Machine Parameters
        ↓
ML Prediction
        ↓
Flask Backend
        ↓
Dashboard Visualization
        ↓
Machine Health Status
        ↓
Email Alert
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature-name
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add feature"
```

5. Push the branch.

```bash
git push origin feature-name
```

6. Create a Pull Request.

---

## 📄 License

This project is developed as part of the **Infosys Springboard Internship Program** for educational and learning purposes.

---

## ⭐ Acknowledgements

* Infosys Springboard
* AI4I 2020 Predictive Maintenance Dataset
* Scikit-learn
* Flask
* MQTT Community
 Bearing Data Center
