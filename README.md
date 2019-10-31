# rfid-lambda-get-uid-data
This Lambda function is triggered when the RFID reader detects a card. It takes the UID of the card, looks up data from a DynamoDB table, and publishes the data to an MQTT topic.

## Environment Variables
* **uid_table_name**: Name of DynamoDB table containing data.
* **uid_topic_name**: MQTT Topic to publish retrieved data to.