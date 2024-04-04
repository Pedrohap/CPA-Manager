const pessoaModel = require ('../models/pessoaModel')

async function createPessoa(sexo,nome,email,cpf,data_nascimento){

    try{
        return await pessoaModel.criarPessoa(sexo,nome,email,cpf,data_nascimento);

    } catch(error) {
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        }
    }
}

async function getPessoaById(Id){
    return await pessoaModel.getPessoaById(Id);
}

async function getPessoaNomeParcial(entrada){
    try {
        return await pessoaModel.getPessoaNomeParcial(entrada);
    } catch(error){
        console.log(error)
        return {status: "error", codigo: error.code}
    }
}

async function removePessoa(entrada){
    return await pessoaModel.removePessoa(entrada);
}

async function updatePessoa(sexo,nome,email,cpf,data_nascimento,id){
    try{
        return await pessoaModel.updatePessoa(sexo,nome,email,cpf,data_nascimento,id);
    }catch(error){ 
        if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_cpf_key"){
            return "CPF já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_id_key"){
            return "ID já Cadastrado";
        } else if (error.code === '23505' && error.constraint === "tbpessoa_pessoa_email_key"){
            return "E-mail já Cadastrado";
        }
    }
}

module.exports = {
    createPessoa,
    updatePessoa,
    getPessoaById,
    getPessoaNomeParcial,
    removePessoa
}