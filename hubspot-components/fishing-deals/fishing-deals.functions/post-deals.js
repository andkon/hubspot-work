
exports.main = ({ accountId, body, params }, sendResponse) => {
  console.log('Your HubSpot account ID: %i', accountId);
  sendResponse({
    statusCode: 200,
    body: {
      message: 'Hello, world!',
    },
  });
};
