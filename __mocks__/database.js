// __mocks__/database.js
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const pool = {
  connect: jest.fn(() => Promise.resolve(mockClient)),
};

module.exports = pool;
