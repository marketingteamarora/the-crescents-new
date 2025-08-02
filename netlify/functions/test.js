exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Test function is working!' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  };
};
