import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const EventBusName = process.env.EventBusName;
const eventBridge = new EventBridgeClient();

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const params = {
    Entries: [
      {
        EventBusName,
        Detail: JSON.stringify({
          vehicleNo: body.vehicleNo,
          NIC: body.nic,
        }),
        DetailType: "user-signup",
        Source: "fuel app",
      },
    ],
  };

  const command = new PutEventsCommand(params);
  try {
    console.info("Starting sending events to EventBridge");
    const { $metadata, ...rest } = await eventBridge.send(command);
    console.info(
      `Events sent successfuly: ${JSON.stringify(
        { $metadata, ...rest },
        null,
        2
      )}`
    );
    return { statusCode: 200, body: JSON.stringify(rest) };
  } catch (error) {
    console.error("Error sending events to EventBridge:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending events to EventBridge" }),
    };
  }
};
