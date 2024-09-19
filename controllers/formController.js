const formularioModel = require('../models/formModel')

async function criarFormulario(dados){
    try {
        return await formularioModel.criarFormulario(dados);
    } catch (error) {
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateFormulario(dados){
    try {
        await formularioModel.updateFormulario(dados);
        return true;
    } catch (error) {~
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeFormulario(id){
    try {
        return await formularioModel.removeFormulario(id);
    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getFormularioById(id){
    try{
        return await formularioModel.getFormularioById(id);
    } catch(error) {
        return error;
    }
}

async function getFormulariosByFiltros(dados){
    try{
        return await formularioModel.getFormulariosByFiltros(dados);
    } catch(error) {
        return error;
    }
}

async function getFormularioNomeParcial(entrada){
    try {
        return await formularioModel.getFormularioNomeParcial(entrada);
    } catch(error){
        return error
    }
}

//Controller de Questão

async function criarQuestao(dados){
    try {
        return await formularioModel.criarQuestao(dados);
    } catch (error) {
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function updateQuestao(dados){
    try {
        await formularioModel.updateQuestao(dados);
        return true;
    } catch (error) {~
        console.log(error)
        if (error.code === '23505'){
            return error.constraint;
        }
        return {status: "error", codigo: error.code}
    }
}

async function removeQuestao(id){
    try {
        return await formularioModel.removeQuestao(id);
    } catch(error) {
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function getQuestaoById(id){
    try{
        return await formularioModel.getQuestaoById(id);
    } catch(error) {
        return error;
    }
}

async function getQuestoesByForm(dados){
    try{
        return await formularioModel.getQuestoesByForm(dados);
    } catch(error) {
        return error;
    }
}

module.exports = {
    criarFormulario,
    updateFormulario,
    removeFormulario,
    getFormularioById,
    getFormularioNomeParcial,
    getFormulariosByFiltros,
    criarQuestao,
    removeQuestao,
    updateQuestao,
    getQuestaoById,
    getQuestoesByForm
}