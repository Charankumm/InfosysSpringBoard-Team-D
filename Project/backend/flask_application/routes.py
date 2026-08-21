import json
import paho.mqtt.client as mqtt
from flask import jsonify

BROKER = "localhost"
PORT = 1883

SENSOR_TOPIC = "factory/machine/+/sensors"
RESULT_TOPIC = "factory/machine/result"

latest_sensor_data = {
    "Type": "L",
    "Air temperature [K]": 0,
    "Process temperature [K]": 0,
    "Rotational speed [rpm]": 0,
    "Torque [Nm]": 0,
    "Tool wear [min]": 0
}

latest_result = {
    "machine_failure": False,
    "failure_probability": 0,
    "failure_type": None,
    "alert": "Waiting for sensor data..."
}


def on_connect(client, userdata, flags, reason_code, properties=None):

    print("Flask MQTT listener connected")

    # Listen for sensor data
    client.subscribe(SENSOR_TOPIC)

    # Listen for ML prediction
    client.subscribe(RESULT_TOPIC)

    print(f"Subscribed to: {SENSOR_TOPIC}")
    print(f"Subscribed to: {RESULT_TOPIC}")


def on_message(client, userdata, msg):

    global latest_sensor_data
    global latest_result

    try:

        payload = msg.payload.decode()

        print("\nMQTT message received:")
        print("Topic:", msg.topic)
        print(payload)

        data = json.loads(payload)

        # Sensor data
        if msg.topic.startswith("factory/machine/") and msg.topic.endswith("/sensors"):

            latest_sensor_data = data

            print("Updated sensor data:")
            print(latest_sensor_data)

        # ML prediction
        elif msg.topic == RESULT_TOPIC:

            latest_result = data

            print("Updated prediction:")
            print(latest_result)

    except Exception as e:

        print("Error reading MQTT message:")
        print(e)


def start_mqtt_listener():

    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2
    )

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(
        BROKER,
        PORT,
        60
    )

    client.loop_forever()


def get_latest_result():

    return jsonify({
        "sensor_data": latest_sensor_data,
        "prediction": latest_result
    })