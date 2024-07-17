$(document).ready(function () {
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()

    $('#btnCancelar').click(function(){
        limpaCampos();
        disableForm();
        $('#btnSalvar').hide();
        $('#btnCancelar').hide()
    })

    //FUNÇÕES DA BARRA DE AUTO COMPLETAR
    $('#idBusca').blur(function(){
        getAlunoByID();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getAlunoByID();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getAlunoNome/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabela(response);
                        $('#nomeBuscaAutoFill').html(html);
                        $('#sugestionTable').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTable').hide();
                }
            })
        }else {
            $('#sugestionTable').hide();
        }
    })


    $('#nomeBusca').blur( function(){
        if ($('#nomeBusca').val() === ''){
            limpaCampos();
            $('#idBusca').val('');
        }
    });

    //FIM DAS FUNÇÕES DA BARRA DE AUTO COMPLETAR

    $("#createAlunoForm").submit(function (e) {
        e.preventDefault();

        if ($('#formAction').val() === 'new'){

            $("#btnSalvar").attr("disabled", "disabled");
            $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);

            //As senhas não conferem ou está vazia, erro é exibido
            if($("#senhaConf").val() != $("#senha").val() && $("#senhaConf").val() != ""){
                $('#modalLabel').html("Erro");
                $('#modalTexto').html("As senhas digitadas não estão iguais!");
                $('#modal').modal('show');
                $("#btnSalvar").removeAttr("disabled").html("Salvar");
                return
            }

            var formData = {
                id: $("#id").val(),
                idAluno: $("#idAluno").val(),
                sexo: $("#sexo").val(),
                nome: $("#nome").val(),
                email: $("#email").val(),
                cpf: $("#cpf").val(),
                data_nascimento: $("#data_nascimento").val(),
                curso: $('#curso').val(),
                curriculo: $('#curriculo').val(),
                serie: $('#serie').val(),
                senha: $('#senha').val()
            };

            $.ajax({
                type: "POST",
                url: "/admin/cadastrarAluno",
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Aluno adicionado com sucesso")
                    $('#modal').modal('show')
                    limpaCampos();
                    disableForm();
                },
                error: function (response){
                    $('#modalLabel').html("Erro");
                    $('#modalTexto').html(response.responseText);
                    $('#modal').modal('show');
                    $("#btnSalvar").removeAttr("disabled").html("Salvar");
                }
            })

        } else if ($('#formAction').val() === 'edit'){
            $('#modalLabelConfirm').html("Alerta de Alteração")
            $('#modalTextoConfirm').html(`Deseja realmente aplicar estas alterações?`)
            $('#modalBtnConfirmar').removeClass();
            $('#modalBtnConfirmar').addClass('btn btn-danger')
            $('#modalBtnConfirmar').html('Alterar')
            $('#modalConfirm').modal('show')

            $('#modalBtnConfirmar').click(function(){
                $('#modalConfirm').modal('hide')

                //As senhas não conferem ou está vazia, erro é exibido
                if($("#senhaConf").val() != $("#senha").val()){
                    $('#modalLabel').html("Erro");
                    $('#modalTexto').html("As senhas digitadas não estão iguais!");
                    $('#modal').modal('show');
                    $("#btnSalvar").removeAttr("disabled").html("Salvar");
                    return
                }

                $("#btnSalvar").attr("disabled", "disabled");
                $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);

                var formData = {
                    id: $("#id").val(),
                    idAluno: $("#idAluno").val(),
                    sexo: $("#sexo").val(),
                    nome: $("#nome").val(),
                    email: $("#email").val(),
                    cpf: $("#cpf").val(),
                    data_nascimento: $("#data_nascimento").val(),
                    curso: $('#curso').val(),
                    curriculo: $('#curriculo').val(),
                    serie: $('#serie').val(),
                    senha: $('#senha').val()
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizaAluno",
                    data: formData,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Aluno atualizado com sucesso")
                        $('#modal').modal('show')
                        limpaCampos();
                        disableForm();
                    },
                    error: function (response){
                        $('#modalLabel').html("Erro");
                        $('#modalTexto').html(response.responseText);
                        $('#modal').modal('show');
                        $("#btnSalvar").removeAttr("disabled").html("Salvar");
                    }
                })
            })
        }
    })

    $('#btnNovo').click(function (){
        $('#formAction').val("new");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", false );
        $('#idAluno').prop( "disabled", false );
        $('#siglaCurso').prop( "disabled", false );
        $('#curso').prop( "disabled", false );
        $('#curriculo').prop( "disabled", false );
        $('#serie').prop( "disabled", false );
        $('#cpf').prop( "disabled", false );
        $('#sexo').prop( "disabled", false );
        $('#email').prop( "disabled", false );
        $('#nome').prop( "disabled", false );
        $('#data_nascimento').prop( "disabled", false );
        $('#senha').prop( "disabled", false );
        $('#senhaConf').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
    })

    $('#btnEditar').click(function (){
        $('#formAction').val("edit");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", true );
        $('#idAluno').prop( "disabled", true );
        $('#siglaCurso').prop( "disabled", false );
        $('#curso').prop( "disabled", false );
        $('#curriculo').prop( "disabled", false );
        $('#serie').prop( "disabled", false );
        $('#cpf').prop( "disabled", false );
        $('#sexo').prop( "disabled", false );
        $('#email').prop( "disabled", false );
        $('#nome').prop( "disabled", false );
        $('#data_nascimento').prop( "disabled", false );
        $('#senha').prop( "disabled", false );
        $('#senhaConf').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
    })

    $('#id').blur(function(){
        getPessoaByID();
    })

    $('#btnExcluir').click(function (){
        if($('#id').val()!= ""){
            $('#modalLabelConfirm').html("Alerta de Exclusão")
            $('#modalTextoConfirm').html(`Deseja realmente excluir a Pessoa ${$('#nome').val()}?`)
            $('#modalBtnConfirmar').removeClass();
            $('#modalBtnConfirmar').addClass('btn btn-danger')
            $('#modalBtnConfirmar').html('Excluir')
            $('#modalConfirm').modal('show')
            
            $('#modalBtnConfirmar').click( function(){
                $('#modalConfirm').modal('hide')
                let id = $('#id').val();
                $.ajax({
                    type: "POST",
                    url: `/admin/excluirPessoaId/${id}`,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Pessoa excluida com Sucesso")
                        $('#modal').modal('show')
                        limpaCampos();
                        disableForm();
                    },
                    error: function (response){
                        $('#modalLabel').html("Erro");
                        $('#modalTexto').html(response.responseText);
                        $('#modal').modal('show');;
                    }
                })
            })
        }
    })

    //FUNÇÕES DA BARRA DE AUTO COMPLETAR DO CURSO E CURRICULO
    $('#siglaCurso').blur(function(){
        $('#siglaCurso').val($('#siglaCurso').val().toUpperCase())
        getCursoBySigla();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getAlunoByID();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getAlunoNome/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabela(response);
                        $('#nomeBuscaAutoFill').html(html);
                        $('#sugestionTable').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTable').hide();
                }
            })
        }else {
            $('#sugestionTable').hide();
        }
    })


    $('#nomeBusca').blur( function(){
        if ($('#nomeBusca').val() === ''){
            limpaCampos();
            $('#idBusca').val('');
        }
    });

    //FIM DAS FUNÇÕES DA BARRA DE AUTO COMPLETAR DO CURSO E CURRICULO

})

function getPessoaByID(){
    let idBusca = $('#id').val();

    $.ajax({
        type: "GET",
        url: `/admin/getPessoaId/${idBusca}`,
        success: function (response) {
            $('#id').val(response.id);
            $('#nome').val(response.nome);
            $('#sexo').val(response.sexo);
            $('#email').val(response.email);
            $('#cpf').val(response.cpf);
            $('#data_nascimento').val(new Date(response.data_nascimento).toISOString().split('T')[0]);
            $('#btnEditar').prop( "disabled", false )
        },
        error: function (response){
            limpaCampos();
            $('#btnEditar').prop( "disabled", true )
        }
    })
}

function getAlunoByID(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getAlunoId/${idBusca}`,
        success: function (response) {
            $('#idAluno').val(response.aluno_id);
            $('#id').val(response.id);
            $('#siglaCurso').val(response.curso_sigla);
            $('#curso').val(response.curso_nome);
            $('#curriculo').val(response.curriculo);
            $('#cpf').val(response.cpf);
            $('#sexo').val(response.sexo);
            $('#email').val(response.email);
            $('#nome').val(response.nome);
            $('#data_nascimento').val(new Date(response.data_nascimento).toISOString().split('T')[0]);
            $('#senha').val("");
            $('#senhaConf').val("");
            $('#nomeBusca').val(response.nome);
            $('#btnEditar').prop( "disabled", false );
            $('#btnExcluir').prop( "disabled", false );
        },
        error: function (response){
            limpaCampos();
            $('#btnEditar').prop( "disabled", true );
            $('#btnExcluir').prop( "disabled", true );
        }
    })
}


function disableForm(){
    $('#btnNovo').prop( "disabled", false );
    $('#idAluno').prop( "disabled", true );
    $('#id').prop( "disabled", true );
    $('#siglaCurso').prop( "disabled", true );
    $('#curso').prop( "disabled", true );
    $('#curriculo').prop( "disabled", true );
    $('#cpf').prop( "disabled", true );
    $('#sexo').prop( "disabled", true );
    $('#email').prop( "disabled", true );
    $('#nome').prop( "disabled", true );
    $('#data_nascimento').prop( "disabled", true );
    $('#senha').prop( "disabled", true );
    $('#senhaConf').prop( "disabled", true );
    $('#serie').prop( "disabled", true );
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()
}

function limpaCampos(){
    $('#idAluno').val("");
    $('#id').val("");
    $('#siglaCurso').val("");
    $('#curso').val("");
    $('#curriculo').val("");
    $('#cpf').val("");
    $('#sexo').val("");
    $('#email').val("");
    $('#nome').val("");
    $('#data_nascimento').val("");
    $('#senha').val("");
    $('#senhaConf').val("");
    $('#serie').val ("");
    $('#btnEditar').prop( "disabled", true )
    $('#btnExcluir').prop( "disabled", true );
}

function geraTabela(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Usuário não encontrado' || response[0].id !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].id}</td><td>${response[i].nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}

function geraTabelaCurso(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Curso não encontrado' || response[0].curso_sigla !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].curso_sigla}</td><td>${response[i].curso_nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}

function geraSelectCurriculo(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Curriculo não encontrado' || response[0].curriculo_nome !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<option value="${response[i].curriculo_id}" selected>${response[i].curriculo_nome}</option>`
        }
    } else{
        html = "";
    }

    return html;
}

function getCursoBySigla(){
    let idBusca = $('#siglaCurso').val();

    $.ajax({
        type: "GET",
        url: `/admin/getCursoSigla/${idBusca}`,
        success: function (response) {
            if(response !== "Curso não encontrado"){
                $('#siglaCurso').val(response.sigla);
                $('#curso').val(response.nome);
                getCurriculosByCurso(response.id);
            } else {
                $('#siglaCurso').val("");
                $('#curso').val("");
            }
        },
        error: function (response){
            $('#siglaCurso').val("");
            $('#curso').val("");
        }
    })
}


function getCurriculosByCurso(curso){
    $('#curriculo').html("")
    $.ajax({
        type: "GET",
        url: `/admin/getCurriculos/${curso}`,
        success: function (response) {
            if(response.length > 0 && response[0].curriculo_nome !== undefined){
                let html;
                for (let i = 0 ; i < response.length ; i++){
                    html += `<option value="${response[i].curriculo_id}">${response[i].curriculo_nome}</option>"`
                }
                $('#curriculo').html(html)
            } else {
                $('#curriculo').html("")
            }
        },
        error: function (response){
            $('#curriculo').html("")
        }
    })
}


function getCursoByID(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getAlunoId/${idBusca}`,
        success: function (response) {
            $('#idAluno').val(response.aluno_id);
            $('#id').val(response.id);
            $('#siglaCurso').val(response.curso_sigla);
            $('#curso').val(response.curso_nome);
            $('#curriculo').val(response.curriculo);
            $('#cpf').val(response.cpf);
            $('#sexo').val(response.sexo);
            $('#email').val(response.email);
            $('#nome').val(response.nome);
            $('#data_nascimento').val(new Date(response.data_nascimento).toISOString().split('T')[0]);
            $('#senha').val("");
            $('#senhaConf').val("");
            $('#nomeBusca').val(response.nome);
            $('#btnEditar').prop( "disabled", false );
            $('#btnExcluir').prop( "disabled", false );
        },
        error: function (response){
            limpaCampos();
            $('#btnEditar').prop( "disabled", true );
            $('#btnExcluir').prop( "disabled", true );
        }
    })
}