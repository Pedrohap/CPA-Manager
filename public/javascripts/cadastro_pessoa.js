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
        getPessoaByID();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getPessoaByID();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });    

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getPessoaNome/${searchTerm}`,
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

    $("#createPessoaForm").submit(function (e) {
        e.preventDefault();

        if ($('#formAction').val() === 'new'){
            $("#btnSalvar").attr("disabled", "disabled");
            $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);
    
            var formData = {
                sexo: $("#sexo").val(),
                nome: $("#nome").val(),
                email: $("#email").val(),
                cpf: $("#cpf").val(),
                data_nascimento: $("#data_nascimento").val()
            };
            $.ajax({
                type: "POST",
                url: "/admin/cadastrarPessoa",
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Pessoa criada com sucesso")
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
                $("#btnSalvar").attr("disabled", "disabled");
                $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);
        
                var formData = {
                    sexo: $("#sexo").val(),
                    nome: $("#nome").val(),
                    email: $("#email").val(),
                    cpf: $("#cpf").val(),
                    data_nascimento: $("#data_nascimento").val(),
                    id: $("#id").val()
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizarPessoa",
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
        $('#btnExcluir').prop( "disabled", true );
        $('#nome').prop( "disabled", false );
        $('#sexo').prop( "disabled", false );
        $('#email').prop( "disabled", false );
        $('#cpf').prop( "disabled", false );
        $('#data_nascimento').prop( "disabled", false );
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
                        console.log(response.responseJSON)
                        $('#modalLabel').html("Erro");
                        $('#modalTexto').html(response.responseJSON.detail);
                        $('#modal').modal('show');;
                    }
                })
            })
        }
    })
})

function getPessoaByID(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getPessoaId/${idBusca}`,
        success: function (response) {
            $('#nomeBusca').val(response.nome);
            $('#id').val(response.id);
            $('#nome').val(response.nome);
            $('#sexo').val(response.sexo);
            $('#email').val(response.email);
            $('#cpf').val(response.cpf);
            $('#data_nascimento').val(new Date(response.data_nascimento).toISOString().split('T')[0]);
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
    $('#id').val("");
    $('#nome').val("");
    $('#sexo').val("");
    $('#email').val("");
    $('#cpf').val("");
    $('#data_nascimento').val("");
    $('#btnEditar').prop( "disabled", true );
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