const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('#findUserByEmail', () => {
  it('should return a user with a valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";

    assert.strictEqual(user.id, expectedOutput);
  });
  it('should return undefined when passed an invalid email', () => {
    const user = getUserByEmail('random@example.com', testUsers);
    const expectedOutput = undefined;

    assert.strictEqual(user.id, expectedOutput);
  });
});
