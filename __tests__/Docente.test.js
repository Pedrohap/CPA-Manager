// __tests__/Docente.test.js
const { criarDocente, updateDocente, getDocenteByID, getDocenteNomeParcial, removeDocente } = require('../models/docenteModel');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

jest.mock('../config/database'); // Mock do módulo database
jest.mock('bcrypt'); // Mock do módulo bcrypt

describe('Funções Docente', () => {
  let mockClient;

  beforeEach(async () => {
    mockClient = await pool.connect(); // Obtemos o mockClient
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('criarDocente deve inserir um docente e confirmar a transação', async () => {
    mockClient.query.mockResolvedValueOnce({}); // Simula sucesso no query

    const dados = {
      idDocente: 1,
      id: 123,
      especializacao: 'Matemática',
      emailInstitucional: 'docente@exemplo.com',
      senha: 'senha123',
    };

    const resultado = await criarDocente(dados);

    expect(resultado).toBe(true);
    expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN, INSERT, COMMIT
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(dados.senha, 'fakeSalt');
  });

});
