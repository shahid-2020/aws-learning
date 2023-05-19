'use strict';
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4 } = require('uuid');

const { send, noteSchemaValidator } = require('./utils');
const logger = require('./logger');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const getNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters.id;
  try {
    const params = {
      TableName: process.env.NOTES_TABLE_NAME,
      Key: { noteId },
    };
    const data = await docClient.send(new GetCommand(params));
    return send(200, { note: data.Item });
  } catch (err) {
    logger.error(err);
    return send(500, err.message);
  }
};

const getNotes = async (_event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: process.env.NOTES_TABLE_NAME,
    };
    const data = await docClient.send(new ScanCommand(params));

    return send(200, { notes: data.Items, count: data.Count });
  } catch (err) {
    logger.error(err);
    return send(500, err.message);
  }
};

const createNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { value, error } = noteSchemaValidator(event.body);
  if (error) {
    return send(400, { message: 'Bad Request' });
  }
  try {
    const noteId = v4();
    const params = {
      TableName: process.env.NOTES_TABLE_NAME,
      Item: {
        noteId,
        ...value,
      },
      conditionExpression: 'attribute_not_exists(notesId)',
    };
    await docClient.send(new PutCommand(params));
    return send(201, { noteId });
  } catch (err) {
    logger.error(err);
    return send(500, err.message);
  }
};

const updateNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters.id;
  const { value, error } = noteSchemaValidator(event.body);
  if (error) {
    return send(400, { message: 'Bad Request' });
  }
  try {
    const params = {
      TableName: process.env.NOTES_TABLE_NAME,
      Key: { noteId },
      UpdateExpression: 'set #title = :title, #description = :description',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#description': 'description',
      },
      ExpressionAttributeValues: {
        ':title': value.title,
        ':description': value.description,
      },
      ConditionExpression: 'attribute_exists(noteId)',
    };
    await docClient.send(new UpdateCommand(params));
    return send(204);
  } catch (err) {
    logger.error(err);
    return send(500, err.message);
  }
};

const deleteNote = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const noteId = event.pathParameters.id;
  try {
    const params = {
      TableName: process.env.NOTES_TABLE_NAME,
      Key: { noteId },
      ConditionExpression: 'attribute_exists(noteId)',
    };
    await docClient.send(new DeleteCommand(params));
    return send(204);
  } catch (err) {
    logger.error(err);
    return send(500, err.message);
  }
};

module.exports = { getNote, getNotes, createNote, updateNote, deleteNote };
