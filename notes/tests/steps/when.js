'use strict';

const axios = require('axios');
const _ = require('lodash');

const makeHttpRequest = async (path, method, options) => {
  const baseUrl = process.env.BASE_URL;
  const url = `${baseUrl}/${path}`;
  const body = _.get(options, 'body');
  const idToken = _.get(options, 'idToken');
  const axiosOptions = {
    method,
    url,
    headers: { Authorization: `${idToken}` },
  };
  if (body) {
    axiosOptions.data = body;
  }
  try {
    const res = await axios(axiosOptions);
    return { statusCode: res.status, body: res.data };
  } catch (err) {
    return { statusCode: err.status || 500, body: null };
  }
};

exports.we_invoke_createNote = (options) => {
  return makeHttpRequest('notes', 'POST', options);
};
