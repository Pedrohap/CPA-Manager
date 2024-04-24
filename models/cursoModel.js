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

        const queryText = 'INSERT INTO tbCurso (curso_sigla,curso_nome) VALUES ($1, $2)';
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
    console.log(dados)
    
    try {
        await client.query('BEGIN');

        const queryText = 
        `UPDATE tbCurso
        SET curso_nome = $2,
            curso_sigla = $3
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

//Curriculos Functions
async function criarCurriculo(dados){
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');

        const queryText = `INSERT INTO tbCurriculo(curriculo_curso,curriculo_nome) VALUES ($1,$2)`;
        const values = [dados.curso,dados.nome];

        await client.query(queryText,values);

        await client.query('COMMIT');

        return true;
    }catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function removeCurriculo(id){
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');
        const queryText = `DELETE FROM tbCurriculo WHERE curriculo_id = $1`;
        const values = [id];

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

async function getCurriculosBydId(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbCurriculo WHERE curriculo_curso = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Curriculo não encontrado";
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
    getCursoNomeParcial,
    criarCurriculo,
    removeCurriculo,
    getCurriculosBydId
}

