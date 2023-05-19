'use strict';
const { v4 } = require('uuid');
const init = require('./steps/init');
const { an_authenticated_user } = require('./steps/given');
const { we_invoke_createNote } = require('./steps/when');

describe('Given an authenticated user', () => {
  let idToken;

  beforeAll(async () => {
    init();
    const user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
  });

  describe('when we invoke POST /notes endpoint', () => {
    it('should create a new note', async () => {
      const body = {
        noteId: v4(),
        title: 'Test title',
        description: 'Test description',
      };

      const result = await we_invoke_createNote({ idToken, body });
      console.log({result})
      expect(result.statusCode).toEqual(201);
      expect(result.body).not.toBe(null);
    });
  });
});

/**
 * Skipping remaining tests as they looked similar
 */