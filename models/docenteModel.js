const pool = require('../config/database')
const bcrypt = require('bcrypt');

class Docente{
    constructor(id,pessoa,especializacao,email_institucional,senha_hash,salt){
        this.id = id;
        this.pessoa = pessoa;
        this.especializacao = especializacao;
        this.email_institucional = email_institucional;
        this.senha_hash = senha_hash;
        this.salt = salt;
    }
}

async function criarDocente(dados){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const senhaHash = await bcrypt.hash(dados.senha, salt);
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbDocente(docente_id,docente_pessoa,docente_especializacao,docente_email_institucional,senha_hash,salt) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [dados.idDocente,dados.id,dados.especializacao,dados.emailInstitucional,senhaHash,salt];
        const { rows } = await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function getDocente(entrada,senha){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbDocente WHERE docente_email_institucional = $1 or docente_id = $1';
        const values = [entrada];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          throw new Error('Usuário não encontrado');
        }

        const docente = rows[0];
        const senhaValida = await bcrypt.compare(senha, docente.senha_hash);

        if (!senhaValida) {
            throw new Error('Senha incorreta');
        }

        return {
            id: docente.docente_id,
            pessoa: docente.docente_pessoa,
            email: docente.docente_email_institucional,
            acesso: 'docente'
        };
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function removeDocente(entrada){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbDocente WHERE docente_email_institucional = $1 or docente_id = $1';
      const values = [entrada];
      await client.query(queryText, values);
  
      await client.query('COMMIT');
  
      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
}

module.exports = {
    criarDocente,
    getDocente,
    removeDocente
}