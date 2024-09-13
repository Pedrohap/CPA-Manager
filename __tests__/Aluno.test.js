// __tests__/Aluno.test.js
const { criarAluno, updateAluno, removeAluno, getAlunoByID, getAlunoNomeParcial } = require('../models/alunoModel');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

jest.mock('../config/database'); // Mock do módulo database
jest.mock('bcrypt'); // Mock do módulo bcrypt

describe('Funções Aluno', () => {
  let mockClient;

  beforeEach(async () => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient); // Configura o mock do pool.connect para retornar mockClient
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('criarAluno deve inserir um aluno e confirmar a transação', async () => {
    bcrypt.genSalt.mockResolvedValue('fakeSalt');
    bcrypt.hash.mockResolvedValue('fakeHash');
    mockClient.query.mockResolvedValueOnce({}); // Simula sucesso no query

    const dados = {
      idAluno: 1,
      serie: '1º Ano',
      id: 123,
      curso: 'Matemática',
      curriculo: 'Currículo Básico',
      senha: 'senha123',
    };

    const resultado = await criarAluno(dados);

    expect(resultado).toBe(true);
    expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN, INSERT, COMMIT
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(dados.senha, 'fakeSalt');
  });

});
