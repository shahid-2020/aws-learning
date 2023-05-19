const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('./logger');

const jwtVerifier = CognitoJwtVerifier.create({
  tokenUse: 'id',
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_WEB_CLIENT,
});

const generatePolicy = (principalId, effect, resource) => {
  let authResponse = { principalId };
  if (effect && resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: 'execute-api:Invoke',
        },
      ],
    };
  }
};

const authorizer = async (event) => {
  const token = event.authorizationToken;
  try {
    const payload = await jwtVerifier.verify(token);
    logger.info(payload);
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch (err) {
    logger.error(err);
    return err;
  }
};

module.exports = { authorizer };

/**
 * https://mynotesdmn-{env}.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=<clientId>redirect_uri=https://localhost:3000
 */