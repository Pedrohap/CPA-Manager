const pool = require('../config/database')

class Disciplina{
    constructor(id,nome){
        this.id = id;
        this.nome = nome;
    }
}

async function criarDisciplina(dados){
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbDisciplina (disciplina_id,disciplina_nome) VALUES ($1, $2)';
        const values = [dados.id,dados.nome];
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

async function updateDisciplina(dados){  
    const client = await pool.connect();
    console.log(dados)
    
    try {
        await client.query('BEGIN');

        const queryText = 
        `UPDATE tbDisciplina
        SET disciplina_nome = $2
        WHERE disciplina_id = $1;`;
        const values = [dados.id,dados.nome];

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

async function removeDisciplina(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbDisciplina WHERE disciplina_id = $1';
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

async function getDisciplinaById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbDisciplina WHERE disciplina_id = $1';
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Disciplina não encontrada";
        }

        const disciplina = rows[0];

        return {
            id: disciplina.disciplina_id,
            nome: disciplina.disciplina_nome,
        };
    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getDisciplinaNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbDisciplina WHERE CHAR_LENGTH(disciplina_nome) >= 4 AND UPPER(disciplina_nome) LIKE UPPER ($1)';
        const values = [`%${entrada}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Disciplina não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    criarDisciplina,
    updateDisciplina,
    removeDisciplina,
    getDisciplinaById,
    getDisciplinaNomeParcial
}

