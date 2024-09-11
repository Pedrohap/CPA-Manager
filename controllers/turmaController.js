const turmaModel = require('../models/turmaModel')

async function criarTurma(dados){
    try {
        return await turmaModel.criarTurma(dados);
    } catch (error) {
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateTurma(dados){
    try {
        await turmaModel.updateTurma(dados);
        return true;
    } catch (error) {~
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeTurma(id){
    try {
        return await turmaModel.removeTurma(id);
    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getTurmaById(id){
    try{
        return await turmaModel.getTurmaById(id);
    } catch(error) {
        return error;
    }
}

async function getTurmasByFiltros(dados){
    try{
        return await turmaModel.getTurmasByFiltros(dados);
    } catch(error) {
        return error;
    }
}

async function getTurmaNomeParcial(entrada){
    try {
        return await turmaModel.getTurmaNomeParcial(entrada);
    } catch(error){
        return error
    }
}

async function addAlunoTurma(dados){
    try {
        return await turmaModel.addAlunoTurma(dados);
    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function removeAlunoTurma(dados){
    try {
        return await turmaModel.removeAlunoTurma(dados);
    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getAlunosTurma(id){
    try {
        return await turmaModel.getAlunosTurma(id);
    } catch(error) {
        console.log(error)
        return error
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