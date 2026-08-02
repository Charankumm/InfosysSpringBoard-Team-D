from flask import Flask, request, jsonify
from flask_cors import CORS

from utils import predict_machine

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

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)