import Paho from "paho-mqtt";

import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


function Sensors() {
    let client;
    client = new Paho.Client(
        "broker.hivemq.com",
        Number(8000),
        `client-id-${parseInt(Math.random() * 100)}`
    );
    const [value, setValue] = useState(0);

    function onMessage(message) {
        if (message.destinationName === "sensor-status/value")
            setValue(message.payloadString);
    }

    function publishTopic(topic, message) {
        // Create a new MQTT message
        const newMessage = new Paho.Message(message);
        newMessage.destinationName = topic;

        // Publish the new message
        client.send(newMessage);
    }

    useEffect(() => {
        client.connect( {
            onSuccess: () => {
                console.log("Connected!");
                client.subscribe("sensor-status/value");
                client.onMessageArrived = onMessage;
                publishTopic("sensor/turnOn", "Turn LED on");
            },
            onFailure: () => {
                console.log("Failed to connect!");
            }
        });
    }, [])


    return (
        <View style={styles.container}>
            <Text>Sensor status is: {value}</Text>
            <StatusBar style="auto" />
        </View>
    );
}

export default Sensors;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
