'user strict';
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.an_authenticated_user = async () => {
  const UserPoolId = process.env.USER_POOL_ID;
  const ClientId = process.env.CLIENT_ID;
  const USERNAME = process.env.USERNAME;
  const PASSWORD = process.env.PASSWORD;

  const params = {
    UserPoolId,
    ClientId,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME,
      PASSWORD,
    },
  };

  return cognito.adminInitiateAuth(params).promise();
};
