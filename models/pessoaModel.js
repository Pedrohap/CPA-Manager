const pool = require('../config/database')

class Pessoa{
    constructor(id,sexo,nome,email,cpf,data_nascimento){
        this.id = id;
        this.sexo = sexo;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
    }
}

async function criarPessoa(sexo,nome,email,cpf,data_nascimento){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbPessoa(pessoa_sexo,pessoa_nome,pessoa_email,pessoa_cpf,pessoa_data_nascimento) VALUES ($1, $2, $3, $4, $5)';
        const values = [sexo,nome,email,cpf,data_nascimento];
        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updatePessoa(sexo,nome,email,cpf,data_nascimento,id){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'UPDATE tbPessoa SET pessoa_sexo = $1, pessoa_nome = $2, pessoa_email = $3, pessoa_cpf = $4, pessoa_data_nascimento = $5 WHERE pessoa_id = $6';
        const values = [sexo,nome,email,cpf,data_nascimento,id];
        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


async function getPessoaById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbPessoa WHERE pessoa_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Usuário não encontrado";
        }

        const pessoa = rows[0];

        return {
            id: pessoa.pessoa_id,
            nome: pessoa.pessoa_nome,
            email: pessoa.pessoa_email,
            cpf: pessoa.pessoa_cpf,
            data_nascimento: pessoa.pessoa_data_nascimento,
            sexo: pessoa.pessoa_sexo
        };
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function removePessoa(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbPessoa WHERE pessoa_id = $1';
      const values = [id];
      await client.query(queryText, values);
  
      await client.query('COMMIT');
  
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
}

async function getPessoaNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM pessoa_dados_basicos WHERE CHAR_LENGTH(nome) >= 4 AND UPPER(nome) LIKE UPPER ($1)';
        const values = [`%${entrada}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Usuário não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    criarPessoa,
    updatePessoa,
    getPessoaById,
    getPessoaNomeParcial,
    removePessoa
}