const express = require('express');
const { ServiceBusClient } = require('@azure/service-bus');

const app = express();
const port = 3000;

app.use(express.json());

const connectionString = process.env.SB_CONNECTION_STRING;
const topicName = process.env.TOPIC_NAME;

async function sendMessageToTopic(message) {
  const sbClient = new ServiceBusClient(connectionString);
  const sender = sbClient.createSender(topicName);

  try {
    await sender.sendMessages(message);
    console.log(`Sent a message to the topic: ${topicName}`);
  } finally {
    await sender.close();
    await sbClient.close();
  }
}

app.post('/publish', async (req, res) => {
  try {
    const messageBody = req.body;
    console.log(`Message body: ${JSON.stringify(messageBody)}`);
    if (!messageBody) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    const message = { body: messageBody };
    console.log(`Sending message: ${JSON.stringify(message)}`);
    await sendMessageToTopic(message);

    return res.status(200).json({ message: 'Message published successfully' });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
