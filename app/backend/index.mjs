import AWS from 'aws-sdk';

let members = [];

export const handler = async (event) => {

  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;
  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  let content = {};

  if(event.body){
    content = JSON.parse(event.body);
  }
 
  if(event.requestContext){
    switch (routeKey) {
      case 'adduser':
        register(connectionId, content.userName);
        break;
      case 'message':
        const callbackURL = `${domainName}/${stage}`;
        await send_message(content.receiverName, content.message, callbackURL);
        break;
      default:
        break;
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("success"),
  };
  return response;
};

const register = (connectionId, userName)=>{
  members[userName] = connectionId;
}

const send_message = async(senderName, receiverName, message, callbackURL) =>{
  try {
    const client = new AWS.ApiGatewayManagementApi({endpoint: callbackURL});
    const receiverConnectionId = members[receiverName];
    await client.postToConnection({
      'ConnectionId': receiverConnectionId,
      'Data': Buffer.from(JSON.stringify({message, senderName}))
    }).promise();
  } catch (error) {
    console.log(error);
  }
}
