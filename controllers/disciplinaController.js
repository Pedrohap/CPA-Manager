const disciplinaModel = require('../models/disciplinaModel')

async function criarDisciplina(dados){
    try{
        return await disciplinaModel.criarDisciplina(dados);
    } catch(error) {
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbdisciplina_disciplina_id"){
            console.log(error)
            return "Cod. de disciplina já Cadastrada";
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateDisciplina(dados){
    try{
        await disciplinaModel.updateDisciplina(dados);
        return true;
    }catch(error){
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbcurso_curso_sigla"){
            return "Cod. de disciplina já Cadastrada";
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeDisciplina(id){
    try{
        return await disciplinaModel.removeDisciplina(id);

    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getDisciplinaById(id){
    try{
        return await disciplinaModel.getDisciplinaById(id);
    } catch(error) {
        return error;
    }
}

async function getDisciplinaNomeParcial(entrada){
    try {
        return await disciplinaModel.getDisciplinaNomeParcial(entrada);
    } catch(error){
        return error
    }
}

module.exports = {
    criarDisciplina,
    updateDisciplina,
    removeDisciplina,
    getDisciplinaById,
    getDisciplinaNomeParcial
}