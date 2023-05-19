const Joi = require('joi');

const send = (statusCode, body) => {
  if (!statusCode && typeof statusCode !== 'number') {
    throw new Error('Invalid StatusCode');
  }
  return {
    statusCode,
    body: body ? JSON.stringify(body) : undefined,
  };
};

const noteSchemaValidator = (body) => {
  if (!body) {
    return { error: 'Body is required' };
  }
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  });

  return schema.validate(JSON.parse(body), {
    stripUnknown: { objects: true },
  });
};

module.exports = { send, noteSchemaValidator };
