from flask import Flask, request, jsonify
from flask_cors import CORS

from utils import predict_machine
from routes import start_mqtt_listener, get_latest_result
import threading


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():

    return jsonify({
        "message": "AI Predictive Maintenance API Running Successfully"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        result = predict_machine(data)

        return jsonify(result)

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/mqtt-result", methods=["GET"])
def mqtt_result():

    return get_latest_result()


if __name__ == "__main__":

    mqtt_thread = threading.Thread(
        target=start_mqtt_listener,
        daemon=True
    )

    mqtt_thread.start()

    app.run(
        debug=True,
        use_reloader=False
    )