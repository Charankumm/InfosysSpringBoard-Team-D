import streamlit as st
import joblib
import numpy as np
import pandas as pd

# Load the pre-trained predictive maintenance model
try:
    model = joblib.load('model.pkl')
except Exception as e:
    st.error("⚠️ Could not load 'model.pkl'. Make sure the file exists in the project directory.")

st.set_page_config(page_title="Predictive Maintenance System", page_icon="⚙️", layout="wide")

# ---------------------------------------------------------------------------
# Global UI Styling (visual layer ONLY — no logic, no data, no behavior changed)
# ---------------------------------------------------------------------------
def inject_global_css():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* App-wide background */
    .stApp {
        background: radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 45%, #0f172a 100%);
    }

    /* Smooth fade-in for main content */
    section.main > div {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Headings */
    h1, h2, h3 {
        color: #f1f5f9 !important;
    }

    /* Generic gradient page title used across pages */
    .page-title {
        font-size: 2.1rem;
        font-weight: 800;
        background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.2rem;
    }

    .page-subtitle {
        color: #94a3b8;
        font-size: 0.98rem;
        margin-bottom: 1.4rem;
    }

    /* Soft glass "card" wrapper for content blocks */
    .glass-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 20px 24px;
        margin-bottom: 18px;
        box-shadow: 0 2px 14px rgba(0,0,0,0.25);
        transition: all 0.25s ease-in-out;
    }
    .glass-card:hover {
        border-color: rgba(129, 140, 248, 0.35);
        box-shadow: 0 6px 22px rgba(99, 102, 241, 0.2);
        transform: translateY(-2px);
    }

    .glass-card p, .glass-card li, .glass-card span {
        color: #cbd5e1 !important;
    }

    .glass-card strong {
        color: #e0e7ff !important;
    }

    .section-heading {
        color: #e2e8f0 !important;
        font-weight: 700;
        margin-top: 0.2rem;
        margin-bottom: 0.8rem;
    }

    /* Images: rounded corners + subtle frame + hover lift */
    div[data-testid="stImage"] img {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 18px rgba(0,0,0,0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    div[data-testid="stImage"] img:hover {
        transform: scale(1.01);
        box-shadow: 0 8px 26px rgba(99, 102, 241, 0.3);
    }
    div[data-testid="stImage"] figcaption {
        color: #94a3b8 !important;
    }

    /* Sliders / Selectboxes wrapped in a soft glass card */
    div[data-testid="stSlider"], div[data-testid="stSelectbox"] {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 14px 18px 6px 18px;
        margin-bottom: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.25s ease-in-out;
    }
    div[data-testid="stSlider"]:hover, div[data-testid="stSelectbox"]:hover {
        border-color: rgba(129, 140, 248, 0.35);
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
    }

    div[data-testid="stSlider"] label p, div[data-testid="stSelectbox"] label p {
        color: #e2e8f0 !important;
        font-weight: 600;
        font-size: 0.95rem;
    }

    div[data-testid="stSlider"] div[data-baseweb="slider"] > div > div {
        background: linear-gradient(90deg, #818cf8, #c084fc) !important;
    }

    div[data-testid="stSlider"] div[role="slider"] {
        background-color: #c084fc !important;
        box-shadow: 0 0 0 6px rgba(192, 132, 252, 0.2) !important;
        transition: box-shadow 0.2s ease-in-out;
    }
    div[data-testid="stSlider"] div[role="slider"]:hover {
        box-shadow: 0 0 0 9px rgba(192, 132, 252, 0.3) !important;
    }

    div[data-testid="stSelectbox"] div[data-baseweb="select"] > div {
        background: rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        border: 1px solid rgba(129, 140, 248, 0.4);
        color: #f1f5f9;
        transition: border-color 0.2s ease-in-out;
    }
    div[data-testid="stSelectbox"] div[data-baseweb="select"] > div:hover {
        border-color: rgba(192, 132, 252, 0.7);
    }

    /* All buttons — smooth, interactive hover/active states */
    div.stButton > button {
        width: 100%;
        background: linear-gradient(90deg, #6366f1, #a855f7);
        color: #ffffff;
        font-weight: 700;
        font-size: 1.05rem;
        padding: 0.7rem 1rem;
        border: none;
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.45);
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, filter 0.2s ease-in-out;
        margin-top: 6px;
    }
    div.stButton > button:hover {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
        filter: brightness(1.08);
    }
    div.stButton > button:active {
        transform: translateY(0px) scale(0.99);
        box-shadow: 0 3px 10px rgba(139, 92, 246, 0.4);
    }
    div.stButton > button:focus {
        outline: none;
        box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.25), 0 4px 16px rgba(139, 92, 246, 0.45);
    }

    /* Result alert boxes (error/success) */
    div[data-testid="stAlert"] {
        border-radius: 16px;
        padding: 16px 18px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.08);
        animation: fadeIn 0.4s ease-in-out;
    }

    /* Footer links — smooth hover */
    .footer-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #c7d2fe !important;
        text-decoration: none !important;
        font-weight: 600;
        padding: 6px 4px;
        border-bottom: 1px solid transparent;
        transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out, transform 0.2s ease-in-out;
    }
    .footer-link:hover {
        color: #f472b6 !important;
        border-bottom: 1px solid #f472b6;
        transform: translateX(3px);
    }

    hr {
        border-color: rgba(255,255,255,0.08) !important;
    }
    </style>
    """, unsafe_allow_html=True)


# Streamlit Layout for Home Page
def home_page():
    st.markdown('<div class="page-title">🚀 Predictive Maintenance System</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">📋 Welcome to the Predictive Maintenance System!</div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="glass-card">
    This tool helps you monitor machine parameters in real-time and predict failure risks before unexpected breakdowns occur. Fill in the sensor metrics and let the system evaluate machine health using machine learning.
    </div>
    """, unsafe_allow_html=True)

    # Image related strictly to project activity
    st.image("Project Activity.png", caption="Predictive Maintenance Workflow")

    st.markdown('<h3 class="section-heading">🛠️ Project Overview</h3>', unsafe_allow_html=True)
    st.markdown("""
    <div class="glass-card">
    This project was developed as part of our <strong>Predictive Maintenance Engineering Project</strong>. The objective was to build an intelligent monitoring system that uses machine learning to evaluate industrial sensor data—such as air temperature, process temperature, rotational speed, torque, and tool wear—to detect potential equipment failures.
    <br><br>
    The system processes user inputs through feature engineering pipelines and runs them through trained models like <strong>Random Forest Classifier</strong> to deliver real-time failure risk assessments.
    </div>
    """, unsafe_allow_html=True)

# Streamlit Layout for About Us Page
def about_us_page():
    st.markdown('<div class="page-title">📖 About Us</div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="glass-card">
    <strong>Our Mission</strong>: We aim to provide <strong>innovative, efficient, and reliable</strong> industrial AI tools that assist engineers and technicians in proactive equipment maintenance. Our mission is to minimize unplanned machine downtime using advanced <strong>Machine Learning</strong> and <strong>AI</strong>.
    </div>
    """, unsafe_allow_html=True)

    # System Architecture Section
    st.markdown('<h3 class="section-heading">🏗️ System Architecture</h3>', unsafe_allow_html=True)
    st.markdown("""
    <div class="glass-card">
    The <strong>Predictive Maintenance System</strong> architecture is designed to seamlessly process multi-sensor telemetric data, perform automatic feature extraction, and deliver real-time operational risk outputs:
    <ol>
    <li><strong>User Interface (UI)</strong>: Built with <strong>Streamlit</strong>, providing operational teams with simple inputs for live sensor metrics.</li>
    <li><strong>Feature Engineering Engine</strong>: Transforms raw readings (e.g., temperature differences, mechanical power, logarithmic scaling) to match training distributions.</li>
    <li><strong>Machine Learning Core</strong>: Uses a trained <strong>Random Forest</strong> classification model to evaluate risk thresholds and failure classes.</li>
    <li><strong>Prediction Engine</strong>: Computes failure probability scores alongside binary health status predictions.</li>
    <li><strong>Visualization &amp; Insights</strong>: Outputs actionable maintenance alerts directly on screen.</li>
    </ol>
    Below is the system architecture diagram:
    </div>
    """, unsafe_allow_html=True)

    # Image of System Architecture
    st.image("system_architecture.png", caption="System Architecture Diagram")

    # Activity Log Section
    st.markdown('<h3 class="section-heading">📊 Project Activity Log</h3>', unsafe_allow_html=True)
    st.markdown("""
    <div class="glass-card">
    Throughout this project, key technical milestones were completed to build the <strong>Predictive Maintenance System</strong>:
    <ol>
    <li><strong>Dataset Ingestion</strong>: Collected telemetric sensor datasets featuring machine performance metrics and structural failure history.</li>
    <li><strong>Exploratory Data Analysis (EDA)</strong>: Handled missing entries, performed outlier detection, and analyzed feature correlation between tool wear and power usage.</li>
    <li><strong>Feature Engineering</strong>: Created interaction features such as Temperature Difference, Mechanical Power, and logarithmic transformations for non-linear metrics.</li>
    <li><strong>Model Tuning &amp; Evaluation</strong>: Trained algorithms including Logistic Regression and Random Forest, evaluating performance using <strong>Precision</strong>, <strong>Recall</strong>, and <strong>ROC-AUC</strong>.</li>
    <li><strong>Deployment &amp; Interface</strong>: Integrated the serialized model (<code>model.pkl</code>) into Streamlit to allow instant, interactive inference.</li>
    </ol>
    This project provided extensive hands-on experience in <strong>end-to-end ML pipelines</strong>, <strong>feature engineering</strong>, and <strong>model deployment</strong>.
    </div>
    """, unsafe_allow_html=True)

    # Project Activity Image
    st.image("Project Activity.png", caption="Project Activity Diagram")

# Streamlit Layout for Prediction Page
def prediction_page():
    st.markdown('<div class="page-title">⚙️ Predictive Maintenance System</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">📋 Enter Machine Sensor Metrics to Predict Failure Risk!</div>', unsafe_allow_html=True)

    # User input fields for prediction
    air_temp = st.slider("🌡️ Air Temperature [K]", min_value=250.0, max_value=350.0, step=0.5, value=300.0)
    process_temp = st.slider("🔥 Process Temperature [K]", min_value=250.0, max_value=350.0, step=0.5, value=310.0)
    rot_speed = st.slider("🔄 Rotational Speed [rpm]", min_value=100, max_value=3000, step=10, value=1500)
    torque = st.slider("💪 Torque [Nm]", min_value=0.0, max_value=100.0, step=0.5, value=40.0)
    tool_wear = st.slider("⏳ Tool Wear [min]", min_value=0, max_value=300, step=1, value=100)
    machine_type = st.selectbox("🏭 Machine Type Quality", ["Low (L)", "Medium (M)", "High (H)"])

    # Preprocess input data and make predictions
    def preprocess_data(air_temp, process_temp, rot_speed, torque, tool_wear, machine_type):
        # Feature Engineering matching training notebook logic
        temp_diff = process_temp - air_temp
        power = (torque * rot_speed) / 9550
        rot_speed_log = np.log(rot_speed)
        torque_log = np.log(torque + 1)
        tool_wear_log = np.log(tool_wear + 1)

        # One-hot encoding machine type
        type_L = 1 if machine_type == "Low (L)" else 0
        type_M = 1 if machine_type == "Medium (M)" else 0

        return pd.DataFrame([[
            air_temp, process_temp, rot_speed, torque, tool_wear,
            temp_diff, power, rot_speed_log, torque_log, tool_wear_log,
            type_L, type_M
        ]])

    if st.button("🔮 Predict Machine Status"):
        input_data = preprocess_data(air_temp, process_temp, rot_speed, torque, tool_wear, machine_type)

        # Make prediction and probability calculation
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1] * 100

        # Display output based on prediction result
        if prediction == 1:
            st.error(f"⚠️ Machine Status: **High Risk of Failure** (Failure Probability: **{probability:.2f}%**)")
            st.markdown('<h3 class="section-heading">☠️ Warning! Urgent Inspection Required.</h3>', unsafe_allow_html=True)
            st.markdown("""
            <div class="glass-card">
            <strong>Possible failure triggers detected:</strong>
            <ul>
            <li>Excessive tool wear buildup</li>
            <li>Thermal dissipation threshold violation (process vs ambient temp)</li>
            <li>Excessive torque load under high rotational speed</li>
            </ul>
            <strong>Critical suggestions:</strong>
            <ul>
            <li><strong>Immediate action:</strong> Schedule maintenance inspection immediately.</li>
            <li>Inspect cutting tool wear and consider replacing worn components.</li>
            <li>Lower operational load or rotational speed to reduce thermal stress.</li>
            </ul>
            <em>Preventive maintenance now saves severe downtime costs later!</em>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.success(f"✅ Machine Status: **Normal Operation** (Failure Risk: **{probability:.2f}%**)")
            st.markdown('<h3 class="section-heading">🎉 Equipment is functioning within optimal parameters!</h3>', unsafe_allow_html=True)
            st.balloons()
            st.markdown("""
            <div class="glass-card">
            <strong>Key status indicators:</strong>
            <ul>
            <li>Safe thermal operating levels</li>
            <li>Balanced power and torque distribution</li>
            <li>Tool wear within safe operational limits</li>
            </ul>
            Equipment is safe to continue scheduled operational cycles.
            </div>
            """, unsafe_allow_html=True)

# Render Chatbot Page from chatbot.py
def show_chatbot_page():
    try:
        from chatbot import show_chatbot
        show_chatbot()
    except ModuleNotFoundError:
        st.error("⚠️ `chatbot.py` file not found. Make sure `chatbot.py` exists in your project folder.")

# Footer for About Us Page
def footer():
    st.markdown("---")
    st.markdown('<h3 class="section-heading">🌐 Connect with us</h3>', unsafe_allow_html=True)

    # LinkedIn Link
    linkedin_url = "https://www.linkedin.com/in/trupti-agrawal-5855b02aa/"
    st.markdown(f'<a class="footer-link" href="{linkedin_url}" target="_blank">🔗 LinkedIn Profile</a>', unsafe_allow_html=True)

    # GitHub Link
    github_url = "https://github.com/truptiagrawal121-dotcom"
    st.markdown(f'<a class="footer-link" href="{github_url}" target="_blank">💻 GitHub Projects</a>', unsafe_allow_html=True)

    # Email Link
    email_address = "trupti.agrawal121@gmail.com"
    st.markdown(f'<a class="footer-link" href="mailto:{email_address}" target="_blank">📧 Email: {email_address}</a>', unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Sidebar Menu Styling
# ---------------------------------------------------------------------------
def inject_sidebar_css():
    st.markdown("""
    <style>
    /* Sidebar background */
    section[data-testid="stSidebar"] {
        background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
        padding-top: 10px;
    }

    section[data-testid="stSidebar"] .block-container {
        padding-top: 1.2rem;
    }

    /* Sidebar title */
    section[data-testid="stSidebar"] h1 {
        color: #ffffff !important;
        font-weight: 800;
        font-size: 1.4rem;
        letter-spacing: 0.5px;
        margin-bottom: 0.2rem;
    }

    section[data-testid="stSidebar"] h3 {
        color: #94a3b8 !important;
        font-weight: 500;
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }

    /* Hide default radio circle */
    section[data-testid="stSidebar"] div[role="radiogroup"] {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 8px;
    }

    section[data-testid="stSidebar"] div[role="radiogroup"] label {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 12px 18px !important;
        transition: all 0.25s ease-in-out;
        cursor: pointer;
        width: 100%;
    }

    section[data-testid="stSidebar"] div[role="radiogroup"] label:hover {
        background: rgba(99, 102, 241, 0.15);
        border-color: rgba(99, 102, 241, 0.5);
        transform: translateX(4px);
    }

    /* Hide the native radio dot */
    section[data-testid="stSidebar"] div[role="radiogroup"] label > div:first-child {
        display: none;
    }

    /* Text inside each option */
    section[data-testid="stSidebar"] div[role="radiogroup"] label div[data-testid="stMarkdownContainer"] p {
        color: #e2e8f0 !important;
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
        transition: color 0.2s ease-in-out;
    }

    /* Selected option — highlighted with gradient */
    section[data-testid="stSidebar"] div[role="radiogroup"] label[data-checked="true"],
    section[data-testid="stSidebar"] div[role="radiogroup"] label:has(input:checked) {
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        border-color: transparent;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
        transform: translateX(4px) scale(1.02);
    }

    section[data-testid="stSidebar"] div[role="radiogroup"] label:has(input:checked) div[data-testid="stMarkdownContainer"] p {
        color: #ffffff !important;
    }
    </style>
    """, unsafe_allow_html=True)


# Sidebar Layout Design
def sidebar_layout():
    inject_global_css()
    inject_sidebar_css()

    st.sidebar.title("🔧 Menu")
    st.sidebar.markdown("### Choose a Page")

    menu_options = {
        "Home": "🏠  Home",
        "About Us": "📖  About Us",
        "Prediction": "⚙️  Prediction",
        "Chatbot": "💬  Chatbot",
    }

    menu = st.sidebar.radio(
        "Go to",
        list(menu_options.keys()),
        format_func=lambda key: menu_options[key],
        label_visibility="collapsed",
    )

    if menu == "Home":
        home_page()
    elif menu == "Prediction":
        prediction_page()
    elif menu == "Chatbot":
        show_chatbot_page()
    else:
        about_us_page()
        footer()

# Run application layout
sidebar_layout()