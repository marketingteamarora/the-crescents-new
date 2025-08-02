const { Handler } = require('@netlify/functions');

const handler = async (event, context) => {
  console.log('Hello function called');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify Function!' }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  };
};

exports.handler = handler;
