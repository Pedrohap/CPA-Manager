const pool = require('../config/database')

class Curso{
    constructor(id,nome,sigla){
        this.id = id;
        this.nome = nome;
        this.sigla = sigla;
    }
}

async function criarCurso(dados){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbCuro(curso_sigla,curso_nome) VALUES ($1, $2)';
        const values = [dados.sigla,dados.nome];
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

async function updateCurso(dados){  
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 
        `UPDATE tbCurso
        SET curso_nome = $2,
            curso_sigla = $3,
        WHERE curso_id = $1;`;
        const values = [dados.id,dados.nome,dados.sigla];

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

async function removeCurso(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbCurso WHERE curso_id = $1';
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

async function getCursoById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbCurso WHERE curso_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Curso não encontrado";
        }

        const curso = rows[0];

        return {
            id: curso.curso_id,
            nome: curso.curso_nome,
            sigla: curso.curso_sigla,
        };
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getCursoBySigla(sigla){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbCurso WHERE curso_sigla = $1';
        const values = [sigla];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Curso não encontrado";
        }

        const curso = rows[0];

        return {
            id: curso.curso_id,
            nome: curso.curso_nome,
            sigla: curso.curso_sigla,
        };
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getCursoNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbCurso WHERE CHAR_LENGTH(curso_nome) >= 4 AND UPPER(curso_nome) LIKE UPPER ($1)';
        const values = [`%${entrada}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Curso não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    criarCurso,
    updateCurso,
    removeCurso,
    getCursoById,
    getCursoBySigla,
    getCursoNomeParcial
}

