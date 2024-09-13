// __mocks__/bcrypt.js
const bcrypt = {
    genSalt: jest.fn(() => Promise.resolve('fakeSalt')),
    hash: jest.fn((senha, salt) => Promise.resolve('fakeHash')),
  };
  
  module.exports = bcrypt;
  