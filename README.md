# 🚀 Machine Learning System for Early Detection of Equipment Failure

> Predict. Prevent. Perform.

An AI-driven predictive maintenance platform that leverages Industrial IoT (IIoT), Machine Learning, and Real-Time Monitoring to predict equipment failures before they occur, enabling proactive maintenance and minimizing operational downtime. :contentReference[oaicite:0]{index=0}

---

## 📌 Project Overview

Traditional maintenance approaches either wait for failures or rely on fixed maintenance schedules, leading to increased downtime, unnecessary maintenance costs, and reduced equipment lifespan.

Our solution combines IoT sensor data with Machine Learning models to continuously monitor industrial equipment, predict Remaining Useful Life (RUL), detect anomalies, and generate intelligent maintenance alerts in real time. :contentReference[oaicite:1]{index=1}

---

## 🎯 Objectives

- Predict machine failures before they occur
- Reduce unplanned downtime
- Optimize maintenance schedules
- Increase equipment lifespan
- Enable real-time monitoring
- Improve operational efficiency

---

## ⚙️ Features

- 📡 Real-time IoT sensor monitoring
- 🤖 Machine Learning-based failure prediction
- 🚨 Smart anomaly detection
- 🔔 Intelligent email alert system
- 📊 Interactive dashboard with live prediction visualization
- 📈 Machine health gauge and failure probability tracking
- 💡 AI-based maintenance recommendations
- 📄 Downloadable PDF health reports
- 📉 Prediction history and trend analysis

---

## 🏗️ System Architecture

```
IoT Sensors
      │
      ▼
Data Ingestion (Kafka / MQTT)
      │
      ▼
Processing Layer
(Spark / Flink)
      │
      ▼
Machine Learning Models
      │
      ▼
Prediction Engine
      │
      ▼
Dashboard & Alerts
```

The system follows a modular architecture with dedicated layers for data ingestion, processing, machine learning inference, and visualization to ensure scalability and fault tolerance. :contentReference[oaicite:2]{index=2}

---

## 🖥️ Dashboard Highlights

The PredictIQ dashboard provides an intuitive interface for monitoring machine health and maintenance insights. It includes:

- Machine parameter input form
- Real-time machine failure prediction
- Dynamic health gauge and status indicator
- Failure probability trend chart
- Prediction history table
- AI-generated maintenance recommendations
- SMTP email alert status display
- Downloadable PDF maintenance report

The dashboard is fully integrated with the Flask backend to display live prediction results from the machine learning model.

---

## 🛠️ Tech Stack

### Backend

- Python
- Flask / FastAPI *(depending on implementation)*

### Machine Learning

- Scikit-learn
- TensorFlow
- XGBoost
- Random Forest
- LSTM

### Data Processing

- Apache Kafka
- MQTT
- Apache Spark
- Apache Flink

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js
- Responsive Dashboard UI

### Database

- Time-Series Database

### Notifications

- Email
- Slack
- SMS

Based on the proposed implementation architecture. :contentReference[oaicite:3]{index=3}

---

## 📂 Datasets

The project uses publicly available benchmark datasets for predictive maintenance:

- NASA C-MAPSS Turbofan Dataset
- AI4I 2020 Predictive Maintenance Dataset
- CWRU Bearing Dataset
- Azure Predictive Maintenance Dataset

Future deployments can integrate proprietary SCADA and IoT historian data for continuous learning. :contentReference[oaicite:4]{index=4}

---

## 🤖 Machine Learning Pipeline

1. Data Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Training
5. RUL Prediction
6. Anomaly Detection
7. Real-Time Inference
8. Continuous Retraining

The pipeline combines feature engineering, supervised learning, anomaly detection, and feedback-driven retraining to adapt to changing equipment conditions. :contentReference[oaicite:5]{index=5}

---

## 📊 Expected Benefits

- Reduce unplanned downtime
- Lower maintenance costs
- Improve operational efficiency
- Increase equipment lifespan
- Enable predictive maintenance decisions

The project targets measurable business improvements such as reduced downtime and maintenance costs while improving asset longevity. :contentReference[oaicite:6]{index=6}

---

## 📁 Repository Structure

```
InfosysSpringBoard-Team-D/
│
├── Project/
│   │
│   ├── backend/
│   │   ├── flask_application/
│   │   │   ├── alerts/
│   │   │   │   ├── alert_manager.py
│   │   │   │   ├── config.py
│   │   │   │   ├── email_alert.py
│   │   │   │   └── __init__.py
│   │   │   ├── app.py
│   │   │   ├── routes.py
│   │   │   └── utils.py
│   │   │
│   │   ├── model_training/
│   │   │   ├── ai4i2020.csv
│   │   │   └── machine_failure_prediction.ipynb
│   │   │
│   │   ├── models/
│   │   │   ├── machine_failure_model.pkl
│   │   │   ├── failure_type_model.pkl
│   │   │   └── label_encoder.pkl
│   │   │
│   │   └── requirements.txt
│   │
│   ├── frontend/
│   │   ├── assets/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   │
│   ├── code/
│   ├── data/
│   ├── datasets/
│   ├── images/
│   └── notebooks/
│
├── Documentation/
│   ├── PPT/
│   │   ├── Predictive_Maintenance_1.pptx
│   │   ├── Predictive_Maintenance_2.pptx
│   │   ├── PredictIQ_Presentation_3.pptx
│   │   └── PredictIQ_Presentation_4.pptx
│   │
│   ├── Video/
│   │   └── Project_demo_video.mp4
│   │
│   └── Documents/
│       └── Project_Report.pdf
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Charankumm/InfosysSpringBoard-Team-D.git
```

### Navigate

```bash
cd InfosysSpringBoard-Team-D
```

### Install Dependencies

```bash
cd backend

pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```



---

## 🔄 Project Workflow

1. User enters machine operating parameters.
2. Frontend sends the data to the Flask backend through REST API.
3. The machine learning model predicts machine failure probability.
4. Prediction results are displayed on the interactive dashboard.
5. If a critical failure is detected, the backend triggers an automated email alert.
6. Users can review prediction history and download the analysis as a PDF report.

---

## 🌱 Future Enhancements

- Federated Learning
- Digital Twin Integration
- Edge AI Deployment
- Prescriptive Maintenance
- Cloud Deployment
- Mobile Monitoring Application

The project roadmap envisions expanding from predictive maintenance toward enterprise-scale, prescriptive intelligence. :contentReference[oaicite:7]{index=7}

---

## 🎥 Demo

The application demonstrates an end-to-end predictive maintenance workflow:

Machine Input → ML Prediction → Dashboard Visualization → Email Alert → PDF Report

---

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push your branch
4. Create a Pull Request
5. Review and Merge

---

## 📄 License

This project is developed as part of the **Infosys Springboard Internship Program** for educational and learning purposes.

---

## ⭐ Acknowledgements

- Infosys Springboard
- NASA Prognostics Data Repository
- UCI Machine Learning Repository
- Microsoft Azure Predictive Maintenance Dataset
- Case Western Reserve University Bearing Data Center
