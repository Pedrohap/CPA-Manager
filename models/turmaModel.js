const pool = require('../config/database')

class Turma{
    constructor(id,docente,disciplina,nome,semestre,ano){
        this.id = id;
        this.docente = docente;
        this.disciplina = disciplina;
        this.nome = nome;
        this.semestre = semestre;
        this.ano = ano;
    }
}

async function criarTurma(dados){
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');

        const queryText = 'INSERT INTO tbTurma (turma_docente, turma_disciplina, turma_nome, turma_semestre, turma_ano) VALUES ($1, $2, $3, $4, $5)';
        const values = [dados.docente, dados.disciplina, dados.nome, dados.semestre, dados.ano];
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

async function updateTurma(dados){
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');

        const queryText = 
        `UPDATE INTO tbTurma 
        SET turma_docente = $2, 
            turma_disciplina = $3, 
            turma_nome = $4, 
            turma_semestre = $5, 
            turma_ano = $6
        WHERE turma_id = $1;`;
        const values = [dados.id, dados.docente, dados.disciplina, dados.nome, dados.semestre, dados.ano];
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

async function removeTurma(id){
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const queryText = 'DELETE FROM tbTurma WHERE turma_id = $1';
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

async function getTurmaById(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = `
        SELECT *FROM tbTurma 
        JOIN docente_dados_basicos ON tbTurma.turma_docente = docente_dados_basicos.id 
        JOIN tbDisciplina ON tbDisciplina.disciplina_id = tbTurma.turma_disciplina 
        WHERE tbTurma.turma_id = $1`;
        const values = [id];
        const { rows } = await client.query(queryText, values)

        if (rows.length === 0) {
          return "Turma não encontrado";
        }

        const turma = rows[0];

        console.log(turma)

        return {
            id: turma.turma_id,
            idDocente: turma.turma_docente,
            nomeDocente: turma.nome,
            idDisciplina: turma.turma_disciplina,
            nomeDisciplina: turma.disciplina_nome,
            nome: turma.turma_nome, 
            semestre: turma.turma_semestre, 
            ano: turma.turma_ano
        };

    } catch (error) {
      throw error;
    } finally {
        client.release();
    }
}

async function getTurmaNomeParcial(entrada){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'SELECT *FROM tbTurma WHERE CHAR_LENGTH(turma_nome) >= 4 AND UPPER(turma_nome) LIKE UPPER ($1)';
        const values = [`%${entrada}%`];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Turma não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

async function getTurmasByFiltros(dados){
    const client = await pool.connect();

    let queryText = 'SELECT *FROM tbTurma WHERE 1=1';
    let values = [];
    console.log(dados)

    if(dados.disciplina){
        queryText += ' AND turma_disciplina = $' + (values.length + 1);
        values.push(dados.disciplina);
    }

    if(dados.semestre){
        queryText += ' AND turma_semestre = $' + (values.length + 1);
        values.push(dados.semestre);
    }

    if(dados.ano){
        queryText += ' AND turma_ano = $' + (values.length + 1);
        values.push(dados.ano);
    }

    if(dados.docente){
        queryText += ' AND turma_docente = $' + (values.length + 1);
        values.push(dados.docente);
    }

    if(dados.nome){
        queryText += ' AND turma_nome = $' + (values.length + 1);
        values.push(dados.nome);
    }

    try {
        console.log(queryText);
        await client.query('BEGIN');
        await client.query(queryText,values);
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Turma não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

//Alunos-Turma Function
async function addAlunoTurma(dados){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO tbturma_aluno (aluno_id, turma_id) VALUES ($1, $2)';
        const values = [dados.aluno_id,dados.turma_id];
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

async function removeAlunoTurma(dados){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
    
        const queryText = 'DELETE FROM tbturma_aluno WHERE turma_id = $1 AND aluno_id = $2';
        const values = [dados.turma,dados.aluno];
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

async function getAlunosTurma(id){
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 
        `SELECT tbaluno.aluno_id as id, tbpessoa.pessoa_nome as nome FROM tbaluno 
        JOIN tbpessoa ON aluno_pessoa = tbpessoa.pessoa_id
        JOIN tbturma_aluno ON tbturma_aluno.aluno_id = tbaluno.aluno_id 
        WHERE tbturma_aluno.turma_id = $1;`
        const values = [id];
        const { rows } = await client.query(queryText, values);

        if (rows.length === 0) {
            return "Alunos não encontrado";
        }

        return rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    criarTurma,
    updateTurma,
    removeTurma,
    getTurmaById,
    getTurmaNomeParcial,
    getTurmasByFiltros,
    addAlunoTurma,
    removeAlunoTurma,
    getAlunosTurma
}