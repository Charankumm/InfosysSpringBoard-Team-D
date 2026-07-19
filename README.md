# 🏭 Predictive Maintenance System using AI

[![Python Version](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-Machine%20Learning-orange.svg)](https://scikit-learn.org/)

## 📖 Overview
The **Predictive Maintenance System** is an end-to-end Machine Learning pipeline and web application designed to predict industrial machine failures before they occur. By analyzing live sensor telemetry (such as torque, rotational speed, and temperature), the system shifts maintenance strategies from reactive to proactive, minimizing downtime and saving operational costs.

This project was built using the **AI4I 2020 Predictive Maintenance Dataset** and features a highly accurate **Random Forest Classifier** optimized for severely imbalanced real-world data, paired with a custom Flask backend and a dynamic HTML5 waveform visualization UI.

## ✨ Key Features
*   **Robust ML Pipeline:** Handles imbalanced datasets using stratified splitting and balanced class weights to maximize the F1-Score for critical failure prediction.
*   **Real-time Inference API:** A Flask-based backend that loads serialized models (`.joblib`) to scale and process new sensor data instantly.
*   **Dynamic Visual UI:** A custom frontend featuring an HTML5 Canvas that renders a live, animated sensor wave. The wave dynamically reacts to the machine's predicted state (Normal vs. Failure).
*   **Feature Importance Analysis:** Explains the "why" behind the AI's decisions by identifying which sensors drive the failure predictions.

## 🛠️ Technology Stack
*   **Core Logic:** Python
*   **Data Science & ML:** Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn
*   **Backend API:** Flask
*   **Frontend UI:** HTML5, CSS3, JavaScript (Canvas API)

## 📂 Project Structure
```text
Utsav_Singh_PBEL3.0/
├── data/
│   └── ai4i2020.csv                    # The training dataset
├── code/
│   ├── templates/
│   │   └── index.html                  # Frontend web interface
│   ├── predictive_maintenance.ipynb    # ML training and EDA notebook
│   └── app.py                          # Flask application server
├── models/
│   ├── predictive_maintenance_rf.joblib # Serialized Random Forest model
│   └── scaler.joblib                   # Serialized Standard Scaler
├── .gitignore
└── README.md
🚀 Installation and Setup
To run this project locally, follow these steps:

1. Clone the repository:

Bash
git clone [https://github.com/Utsav006/Utsav_Singh_PBEL3.0.git](https://github.com/Utsav006/Utsav_Singh_PBEL3.0.git)
cd Utsav_Singh_PBEL3.0
2. Create and activate a virtual environment:

Bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
3. Install the required dependencies:

Bash
pip install pandas numpy scikit-learn matplotlib seaborn flask joblib
4. Launch the web application:

Bash
cd code
python app.py
5. Access the UI:
Open your web browser and navigate to: http://127.0.0.1:5000

🧪 Testing the Model
To see the failure alert and dynamic red waveform in action, input the following parameters into the UI. These values simulate a Power Failure (abnormally high speed, abnormally low torque):

Machine Quality Type: Low (L)

Air Temperature [K]: 298.9

Process Temperature [K]: 309.1

Rotational Speed [rpm]: 2861

Torque [Nm]: 4.6

Tool Wear [min]: 143

👨‍💻 Author
Utsav Singh

GitHub: @Utsav006
