// __tests__/Pessoa.test.js
const { criarPessoa, updatePessoa, getPessoaById, removePessoa, getPessoaNomeParcial } = require('../models/pessoaModel');
const pool = require('../config/database'); // O Jest usará o mock definido em __mocks__/database.js

describe('Funções Pessoa', () => {
  let mockClient;

  beforeEach(async () => {
    mockClient = await pool.connect(); // Espera a Promise resolver
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('criarPessoa deve inserir uma pessoa e confirmar a transação', async () => {
    mockClient.query.mockResolvedValueOnce({}); // Simula que a query foi bem-sucedida

    const resultado = await criarPessoa('F', 'João', 'joao@example.com', '12345678901', '1990-01-01');

    expect(resultado).toBe(true);
    expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN, INSERT, COMMIT
  });

  test('updatePessoa deve atualizar uma pessoa e confirmar a transação', async () => {
    mockClient.query.mockResolvedValueOnce({}); // Simula que a query foi bem-sucedida

    const resultado = await updatePessoa('M', 'Maria', 'maria@example.com', '10987654321', '1985-05-05', 1);

    expect(resultado).toBe(true);
    expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN, UPDATE, COMMIT
  });
});
