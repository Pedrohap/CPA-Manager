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
        getTurmaByID();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getTurmaByID();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getTurmaNomeParc/${searchTerm}`,
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

    $("#createTurmaForm").submit(function (e) {
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
                nome: $('#nome').val(),
                ano: $('#ano').val(),
                semestre: $('#semestre').val(),
                docente: $('#idDocente').val(),
                disciplina: $('#idDiciplina').val()
            };

            $.ajax({
                type: "POST",
                url: "/admin/cadastrarTurma",
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
                    nome: $('#nome').val(),
                    ano: $('#ano').val(),
                    semestre: $('#semestre').val(),
                    docente: $('#idDocente').val(),
                    disciplina: $('#idDiciplina').val()
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizaTurma",
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
        $('#id').prop( "disabled", true );
        $('#nome').prop( "disabled", false );
        $('#ano').prop( "disabled", false );
        $('#semestre').prop( "disabled", false );
        $('#idDocente').prop( "disabled", false );
        $('#nomeDocente').prop( "disabled", false );
        $('#idDiciplina').prop( "disabled", false );
        $('#nomeDisciplina').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
    })

    $('#btnEditar').click(function (){
        $('#formAction').val("edit");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", true );
        $('#nome').prop( "disabled", false );
        $('#ano').prop( "disabled", false );
        $('#semestre').prop( "disabled", false );
        $('#idDocente').prop( "disabled", false );
        $('#nomeDocente').prop( "disabled", false );
        $('#idDiciplina').prop( "disabled", false );
        $('#nomeDisciplina').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
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

    //FUNÇÕES DA BARRA DE AUTO COMPLETAR DO DOCENTE E DISCIPLINA
    $('#idDocente').blur(function(){
        getDocenteByID();
    })

    $('#nomeDocente').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getDocenteNome/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabela(response);
                        $('#nomeDocenteBuscaAutoFill').html(html);
                        $('#sugestionTableDocente').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTableDocente').hide();
                }
            })
        }else {
            $('#sugestionTableDocente').hide();
        }
    })


    $('#nomeDocente').blur( function(){
        if ($('#nomeDocente').val() === ''){
            $('#idDocente').val('');
        }
    });

    $("#nomeDocenteBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idDocente').val(id);
        $('#nomeDocente').val(nome);
        getDocenteByID();
        $('#nomeDocenteBuscaAutoFill').html('');
        $('#sugestionTableDocente').hide();
    });

    $('#idDocente').blur(function(){
        getDocenteByID();
    })

    $('#nomeDisciplina').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getDisciplinaNome/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabelaDisciplina(response);
                        $('#nomeDisciplinaBuscaAutoFill').html(html);
                        $('#sugestionTableDisciplina').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTableDisciplina').hide();
                }
            })
        }else {
            $('#sugestionTableDocente').hide();
        }
    })


    $('#nomeDisciplina').blur( function(){
        if ($('#nomeDisciplina').val() === ''){
            $('#idDiciplina').val('');
        }
    });

    $("#nomeDisciplinaBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idDiciplina').val(id);
        $('#nomeDisciplina').val(nome);
        getDisciplinaById();
        $('#nomeDisciplinaBuscaAutoFill').html('');
        $('#sugestionTableDisciplina').hide();
    });

    $('#idDiciplina').blur(function(){
        getDisciplinaById();
    })
    //FIM DAS FUNÇÕES DA BARRA DE AUTO COMPLETAR DO CURSO E CURRICULO

})

function getDocenteByID(){
    let idBusca = $('#idDocente').val();
    $.ajax({
        type: "GET",
        url: `/admin/getDocenteId/${idBusca}`,
        success: function (response) {
            $('#idDocente').val(response.docente_id);
            $('#nomeDocente').val(response.nome);
        },
        error: function (response){
            $('#idDocente').val("");
            $('#nomeDocente').val("");
        }
    })
}

function getDisciplinaById(){
    let idBusca = $('#idDiciplina').val();

    $.ajax({
        type: "GET",
        url: `/admin/getDisciplinaId/${idBusca}`,
        success: function (response) {
            $('#idDiciplina').val(response.id);
            $('#nomeDisciplina').val(response.nome);
        },
        error: function (response){
            $('#idDiciplina').val("");
            $('#nomeDisciplina').val("");
        }
    })
}

function getTurmaByID(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getTurmaId/${idBusca}`,
        success: function (response) {
            $('#id').val(response.id);
            $('#nome').val(response.nome);
            $('#ano').val(response.ano);
            $('#semestre').val(response.semestre);
            $('#idDocente').val(response.docente);
            $('#nomeDocente').val(response.nomeDocente);
            $('#idDiciplina').val(response.disciplina);
            $('#nomeDisciplina').val(response.nomeDisciplina);
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
    $('#id').prop( "disabled", true );
    $('#nome').prop( "disabled", true );
    $('#ano').prop( "disabled", true );
    $('#semestre').prop( "disabled", true );
    $('#idDocente').prop( "disabled", true );
    $('#nomeDocente').prop( "disabled", true );
    $('#idDiciplina').prop( "disabled", true );
    $('#nomeDisciplina').prop( "disabled", true );
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()
}

function limpaCampos(){
    $('#id').val("");
    $('#nome').val("");
    $('#ano').val("");
    $('#semestre').val("");
    $('#idDocente').val("");        
    $('#nomeDocente').val("");        
    $('#idDiciplina').val("");        
    $('#nomeDisciplina').val("");
    $('#btnEditar').prop( "disabled", true )
    $('#btnExcluir').prop( "disabled", true );
}

function geraTabela(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Docente não encontrado' || response[0].id !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].id}</td><td>${response[i].nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}

function geraTabelaDisciplina(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Disciplina não encontrado' || response[0].id !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].disciplina_id}</td><td>${response[i].disciplina_nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}