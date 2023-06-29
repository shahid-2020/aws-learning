export const handler = async (event) => {
  console.log('event', JSON.stringify(event));
  const records = event.Records;
  const batchItemFailures = [];

  if (records.length) {
    for (const record of records) {
      try {
        const parsedBody = JSON.parse(record.body);
        console.log('processing vehicle details', parsedBody.detail.vehicleNo);
        console.log('processing successful', record.messageId);
      } catch (err) {
        batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  }

  return { batchItemFailures };
};
