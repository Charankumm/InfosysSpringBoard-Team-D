import json
import time
import random

import paho.mqtt.client as mqtt


BROKER = "localhost"
PORT = 1883

TOPIC = "factory/machine/M001/sensors"


client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION2
)

client.connect(BROKER, PORT, 60)


while True:

    data = {
        "Type": random.choice(["L", "M"]),

        "Air temperature [K]": round(
            random.uniform(295, 305), 2
        ),

        "Process temperature [K]": round(
            random.uniform(305, 315), 2
        ),

        "Rotational speed [rpm]": random.randint(
            1400, 1800
        ),

        "Torque [Nm]": round(
            random.uniform(30, 60), 2
        ),

        "Tool wear [min]": random.randint(
            50, 200
        )
    }

    message = json.dumps(data)

    client.publish(
        TOPIC,
        message
    )

    print("\nPublished sensor data:")
    print(message)

    time.sleep(5)