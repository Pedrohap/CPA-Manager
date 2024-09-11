const pool = require('../config/database')
const bcrypt = require('bcrypt');

class Aluno{
    constructor(id,serie,pessoa,curso,curriculo,senha_hash,salt){
        this.id = id;
        this.serie = serie;
        this.pessoa = pessoa;
        this.curso = curso;
        this.curriculo = curriculo;
        this.senha_hash = senha_hash;
        this.salt = salt;
    }
}

async function criarAluno(dados){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const senhaHash = await bcrypt.hash(dados.senha, salt);

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbAluno (aluno_id,aluno_serie,aluno_pessoa,aluno_curso,aluno_curriculo,senha_hash,salt) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        const values = [dados.idAluno,dados.serie,dados.id,dados.curso,dados.curriculo,senhaHash,salt]
        await client.query(queryText,values);
        
        await client.query('COMMIT');

        return true;
    }catch(error){
        await client.query('ROLLBACK');
        throw error;
    }finally{
        client.release();
    }        
}

async function updateAluno(dados){  
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        if(dados.senha != ""){
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const senhaHash = await bcrypt.hash(dados.senha, salt);

            const queryText = 
            `UPDATE tbAluno
            SET aluno_curso = $2,
                aluno_curriculo = $3,
                senha_hash = $4,
                salt = $5
                aluno_serie = $6
            WHERE aluno_id = $1;`;
            const values = [dados.idAluno,dados.curso,dados.curriculo,senhaHash,salt,dados.serie];

            await client.query(queryText,values);

        } else {
            const queryText = 
            `UPDATE tbAluno
            SET aluno_curso = $2,
                aluno_curriculo = $3
                aluno_serie = $4
            WHERE aluno_id = $1;`;
            const values = [dados.idAluno,dados.curso,dados.curriculo,dados.serie];

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

async function removeAluno (idAluno){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbAluno WHERE aluno_id = $1';
      const values = [idAluno];
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

async function getAlunoByID(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM aluno_dados WHERE aluno_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          throw new Error('Aluno não encontrado');
        }

        const aluno = rows[0];

        return aluno;
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getAlunoNomeParcial(nomeParc){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM aluno_dados_basicos WHERE CHAR_LENGTH(nome) >= 4 AND UPPER(nome) LIKE UPPER ($1)';
        const values = [`%${nomeParc}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Aluno não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    criarAluno,
    updateAluno,
    removeAluno,
    getAlunoByID,
    getAlunoNomeParcial
}
