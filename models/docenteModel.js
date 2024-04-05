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

async function updateDocente(dados){  
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        if(dados.senha != ""){
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const senhaHash = await bcrypt.hash(dados.senha, salt);

            const queryText = 
            `UPDATE tbDocente
            SET docente_especializacao = $2,
                docente_email_institucional = $3,
                senha_hash = $4,
                salt = $5
            WHERE docente_id = $1;`;
            const values = [dados.idDocente,dados.especializacao,dados.emailInstitucional,senhaHash,salt];

            await client.query(queryText,values);

        }else {
            const queryText = 
            `UPDATE tbDocente
            SET docente_especializacao = $2,
                docente_email_institucional = $3
            WHERE docente_id = $1;`;
            const values = [dados.idDocente,dados.especializacao,dados.emailInstitucional];

            await client.query(queryText,values);
        }


        await client.query('COMMIT');

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


async function getDocenteByID(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM docente_dados WHERE docente_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          throw new Error('Usuário não encontrado');
        }

        const docente = rows[0];

        return docente;
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getDocenteNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM docente_dados_basicos WHERE CHAR_LENGTH(nome) >= 4 AND UPPER(nome) LIKE UPPER ($1)';
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
    updateDocente,
    getDocenteByID,
    getDocenteNomeParcial,
    removeDocente
}