import streamlit as st
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Modern Chatbot UI Styling (ONLY the visual layer is changed — no logic)
# ---------------------------------------------------------------------------
def inject_chatbot_css():
    st.markdown("""
    <style>
    /* Page background gradient for chatbot view */
    .stApp {
        background: radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 45%, #0f172a 100%);
    }

    /* Chatbot header title */
    .chatbot-title {
        font-size: 2.1rem;
        font-weight: 800;
        background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.2rem;
    }

    .chatbot-subtitle {
        color: #94a3b8;
        font-size: 0.95rem;
        margin-bottom: 1.4rem;
    }

    /* Chat message container spacing */
    div[data-testid="stChatMessage"] {
        border-radius: 18px;
        padding: 14px 18px;
        margin-bottom: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.06);
    }

    /* User bubble */
    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatarUser"]) {
        background: linear-gradient(135deg, #4338ca, #6d28d9);
    }

    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatarUser"]) p {
        color: #f1f5f9 !important;
    }

    /* Assistant bubble */
    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatarAssistant"]) {
        background: rgba(255, 255, 255, 0.05);
    }

    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatarAssistant"]) p {
        color: #e2e8f0 !important;
    }

    /* Chat input box */
    div[data-testid="stChatInput"] {
        border-radius: 16px;
        border: 1px solid rgba(129, 140, 248, 0.4);
        background: rgba(255, 255, 255, 0.04);
        box-shadow: 0 0 18px rgba(129, 140, 248, 0.15);
    }

    div[data-testid="stChatInput"] textarea {
        color: #f1f5f9 !important;
    }

    /* Spinner text */
    div[data-testid="stSpinner"] p {
        color: #c084fc !important;
        font-weight: 500;
    }
    </style>
    """, unsafe_allow_html=True)


def show_chatbot():
    inject_chatbot_css()

    st.markdown('<div class="chatbot-title">💬 Maintenance AI Assistant</div>', unsafe_allow_html=True)
    st.markdown('<div class="chatbot-subtitle">Ask any questions regarding machine telemetry, operational thresholds, or predictive failure risks!</div>', unsafe_allow_html=True)

    # 1. Retrieve API Key securely from Streamlit secrets
    try:
        api_key = st.secrets["GEMINI_API_KEY"]
    except KeyError:
        st.error("⚠️ `GEMINI_API_KEY` not found in `.streamlit/secrets.toml`. Please add your key to proceed.")
        return

    # 2. Initialize Gemini Client
    client = genai.Client(api_key=api_key)

    # 3. Define System Instructions to give the chatbot context about your project
    system_instruction = """
    You are an expert AI Assistant specialized in Industrial Predictive Maintenance and Machinery Health Monitoring.
    You assist engineers and technicians using the Predictive Maintenance System.
    You answer questions related to:
    - Machine sensor parameters (Air Temperature, Process Temperature, Rotational Speed, Torque, Tool Wear).
    - Failure mechanisms (Overstrain, Heat Dissipation Failure, Tool Wear Failure, Power Failure).
    - Predictive ML models like Random Forest and feature engineering (Temperature Difference, Mechanical Power calculations).
    Keep your answers concise, practical, and focused on industrial preventive maintenance.
    """

    # 4. Initialize Chat History in Streamlit Session State
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! I am your Predictive Maintenance Assistant. How can I help you analyze equipment metrics or failure risks today?"}
        ]

    # 5. Display existing conversation history
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # 6. Handle user input and generate response
    if prompt := st.chat_input("Ask about machine health, torque limits, or tool wear..."):
        # Display user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate response using Gemini
        with st.chat_message("assistant"):
            with st.spinner("Analyzing machine telemetry..."):
                try:
                    # Map message history to Gemini API format
                    contents = []
                    for m in st.session_state.messages:
                        role = "user" if m["role"] == "user" else "model"
                        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=m["content"])]))

                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=contents,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=0.7,
                        )
                    )

                    bot_reply = response.text
                    st.markdown(bot_reply)
                    st.session_state.messages.append({"role": "assistant", "content": bot_reply})

                except Exception as e:
                    st.error(f"Error generating response: {e}")