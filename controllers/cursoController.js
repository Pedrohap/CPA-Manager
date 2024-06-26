const cursoModel = require('../models/cursoModel')

async function criarCurso(dados){
    try{
        return await cursoModel.criarCurso(dados);
    } catch(error) {
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbcurso_curso_sigla"){
            console.log(error)
            return "Sigla já Cadastrada";
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateCurso(dados){
    try{
        await cursoModel.updateCurso(dados);
        return true;
    }catch(error){
        console.log(error);
        if (error.code === '23505' && error.constraint === "tbcurso_curso_sigla"){
            return "Sigla já Cadastrada";
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeCurso(id){
    try{
        return await cursoModel.removeCurso(id);

    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getCursoById(id){
    try{
        return await cursoModel.getCursoById(id);
    } catch(error) {
        return error;
    }
}

async function getCursoBySigla(sigla){
    try{
        return await cursoModel.getCursoBySigla(sigla);
    } catch(error) {
        return error;
    }
}

async function getCursoNomeParcial(entrada){
    try {
        return await cursoModel.getCursoNomeParcial(entrada);
    } catch(error){
        return error
    }
}

async function criarCurriculo(dados){
    try {
        return await cursoModel.criarCurriculo(dados);
    } catch (error) {
        console.log(error);
        return {status: "error", codigo: error.code}
    }
}

async function removeCurriculo(id){
    try {
        return await cursoModel.removeCurriculo(id);
    } catch (error) {
        console.log(error);
        return {status: "error", codigo: error.code}
    }
}

async function getCurriculosBydId(id){
    try {
        return await cursoModel.getCurriculosBydId(id);
    } catch (error) {
        console.log(error);
        return {status: "error", codigo: error.code}
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