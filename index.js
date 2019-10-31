const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    params: {
        region: process.env.AWS_REGION
    }
})

let iot = new AWS.Iot({
    region: process.env.AWS_REGION
});

exports.handler = async (event) => {
    
    if (!event.uid) {
        console.log('No uid provided in message');
        console.log(event);
        return;
    }
    
    let params = {
        TableName: process.env.uid_table_name,
        Key: {
            'uid': event.uid
        }
    }
    
    let data = await docClient.get(params).promise();
    
    if (!data.Item) {
        console.log('Uid not found');
        return;
    }
    
    let uidData = data.Item;
    
    let iotEndpoint = await iot.describeEndpoint().promise()
        .catch((err) => { console.log(err) });
    

    let iotData = new AWS.IotData({
        endpoint: iotEndpoint.endpointAddress,
        region: process.env.AWS_REGION
    });

    let iotMessage = {
        topic: process.env.uid_topic_name,
        payload: JSON.stringify(uidData)
    }

    let iotPublishResponse = await iotData.publish(iotMessage).promise()
        .catch((err) => { console.log(err) });

    return iotPublishResponse;
    
};

