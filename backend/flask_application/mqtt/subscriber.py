import json
import paho.mqtt.client as mqtt

import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

from utils import predict_machine


BROKER = "localhost"
PORT = 1883

SENSOR_TOPIC = "factory/machine/+/sensors"
RESULT_TOPIC = "factory/machine/result"


def on_connect(client, userdata, flags, reason_code, properties=None):

    print("Connected to MQTT broker")

    client.subscribe(SENSOR_TOPIC)

    print(f"Subscribed to: {SENSOR_TOPIC}")


def on_message(client, userdata, msg):

    try:

        print("\n-----------------------------")
        print("MQTT message received")
        print("-----------------------------")

        # Get MQTT message
        payload = msg.payload.decode()

        print("Raw message:")
        print(payload)

        # Convert JSON string to Python dictionary
        data = json.loads(payload)

        print("\nSensor data:")
        print(data)

        # Run ML prediction
        result = predict_machine(data)

        print("\nML Prediction:")
        print(result)

        # Combine sensor data + prediction
        mqtt_result = {
            "sensor_data": data,
            "machine_failure": result["machine_failure"],
            "failure_probability": result["failure_probability"],
            "failure_type": result["failure_type"],
            "alert": result["alert"]
        }

        print("\nFinal MQTT result:")
        print(mqtt_result)

        # Publish combined result
        client.publish(
            RESULT_TOPIC,
            json.dumps(mqtt_result)
        )

        print("\nPrediction + sensor data published")

    except Exception as e:

        print("Error processing MQTT message:")
        print(e)


def start_mqtt():

    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2
    )

    client.on_connect = on_connect
    client.on_message = on_message

    print("Connecting to MQTT broker...")

    client.connect(
        BROKER,
        PORT,
        60
    )

    client.loop_forever()


if __name__ == "__main__":
    start_mqtt()