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
        getDocenteByID();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getDocenteByID();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getDocenteNome/${searchTerm}`,
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

    $("#createDocenteForm").submit(function (e) {
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
                idDocente: $("#idDocente").val(),
                sexo: $("#sexo").val(),
                nome: $("#nome").val(),
                email: $("#email").val(),
                cpf: $("#cpf").val(),
                data_nascimento: $("#data_nascimento").val(),
                idDocente: $('#idDocente').val(),
                especializacao: $('#especializacao').val(),
                emailInstitucional: $('#emailInstitucional').val(),
                senha: $('#senha').val()
            };

            $.ajax({
                type: "POST",
                url: "/admin/cadastrarDocente",
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Docente criada com sucesso")
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
            $('#modalTextoConfirm').html(`Deseja realmente estas alterações?`)
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
                    idDocente: $("#idDocente").val(),
                    sexo: $("#sexo").val(),
                    nome: $("#nome").val(),
                    email: $("#email").val(),
                    cpf: $("#cpf").val(),
                    data_nascimento: $("#data_nascimento").val(),
                    idDocente: $('#idDocente').val(),
                    especializacao: $('#especializacao').val(),
                    emailInstitucional: $('#emailInstitucional').val(),
                    senha: $('#senha').val()
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizarDocente",
                    data: formData,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Pessoa atualizada com sucesso")
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
        $('#idDocente').prop( "disabled", false );
        $('#especializacao').prop( "disabled", false );
        $('#emailInstitucional').prop( "disabled", false );
        $('#senha').prop( "disabled", false );
        $('#senhaConf').prop( "disabled", false );
        $('#nome').prop( "disabled", false );
        $('#sexo').prop( "disabled", false );
        $('#email').prop( "disabled", false );
        $('#cpf').prop( "disabled", false );
        $('#data_nascimento').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
    })

    $('#btnEditar').click(function (){
        $('#formAction').val("edit");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", true );
        $('#idDocente').prop( "disabled", true );
        $('#especializacao').prop( "disabled", false );
        $('#emailInstitucional').prop( "disabled", false );
        $('#senha').prop( "disabled", false );
        $('#senhaConf').prop( "disabled", false );
        $('#nome').prop( "disabled", false );
        $('#sexo').prop( "disabled", false );
        $('#email').prop( "disabled", false );
        $('#cpf').prop( "disabled", false );
        $('#data_nascimento').prop( "disabled", false );
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

function getDocenteByID(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getDocenteId/${idBusca}`,
        success: function (response) {
            $('#idDocente').val(response.docente_id);
            $('#especializacao').val(response.especializacao);
            $('#emailInstitucional').val(response.email_institucional);
            $('#senha').val("");
            $('#senhaConf').val("");
            $('#nomeBusca').val(response.nome);
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


function disableForm(){
    $('#btnNovo').prop( "disabled", false );
    $('#id').prop( "disabled", true );
    $('#idDocente').prop( "disabled", true );
    $('#especializacao').prop( "disabled", true );
    $('#emailInstitucional').prop( "disabled", true );
    $('#senha').prop( "disabled", true );
    $('#senhaConf').prop( "disabled", true );
    $('#nome').prop( "disabled", true );
    $('#sexo').prop( "disabled", true );
    $('#email').prop( "disabled", true );
    $('#cpf').prop( "disabled", true );
    $('#data_nascimento').prop( "disabled", true );
    $('#btnSalvar').hide()
}

function limpaCampos(){
    $('#idBusca').val("");
    $('#nomeBusca').val("");
    $('#idDocente').val("");
    $('#especializacao').val("");
    $('#emailInstitucional').val("");
    $('#senha').val("");
    $('#senhaConf').val("");
    $('#id').val("");
    $('#nome').val("");
    $('#sexo').val("");
    $('#email').val("");
    $('#cpf').val("");
    $('#data_nascimento').val("");
    $('#btnEditar').prop( "disabled", true )
}

function geraTabela(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Usuário não encontrado'){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].id}</td><td>${response[i].nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}