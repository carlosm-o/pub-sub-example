const { delay, ServiceBusClient } = require("@azure/service-bus");

class ServiceBusListener {
    constructor(connectionString, topicName, subscriptionName) {
        this.connectionString = connectionString;
        this.topicName = topicName;
        this.subscriptionName = subscriptionName;
        this.sbClient = new ServiceBusClient(connectionString);
    }

    async startListening() {
        const receiver = this.sbClient.createReceiver(this.topicName, this.subscriptionName);

        // function to handle messages
        const myMessageHandler = async (messageReceived) => {
            console.log(`Received message: ${JSON.stringify(messageReceived.body)}`);
            // Add your custom logic to handle the received message
        };

        // function to handle any errors
        const myErrorHandler = async (error) => {
            console.log(error);
        };

        // subscribe and specify the message and error handlers
        receiver.subscribe({
            processMessage: myMessageHandler,
            processError: myErrorHandler
        });

        // Waiting long enough before closing the receiver to listen to messages
        await delay(5000);
    }

    async stopListening() {
        await this.sbClient.close();
    }
}

// Usage
const connectionString = process.env.SB_CONNECTION_STRING;
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

const listener = new ServiceBusListener(connectionString, topicName, subscriptionName);

listener.startListening().catch((err) => {
    console.log("Error occurred while starting listener: ", err);
    process.exit(1);
});

// To stop listening after a certain period or whenever needed
// Uncomment the following line or use it based on your requirements
// listener.stopListening();
