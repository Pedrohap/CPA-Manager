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
        getDisciplinaById();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getDisciplinaById();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getDisciplinaNome/${searchTerm}`,
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

    $("#createDisciplinaForm").submit(function (e) {
        e.preventDefault();

        if ($('#formAction').val() === 'new'){

            $("#btnSalvar").attr("disabled", "disabled");
            $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);

            var formData = {
                id: $("#id").val(),
                nome: $("#nome").val(),
            };

            $.ajax({
                type: "POST",
                url: "/admin/cadastrarDisciplina",
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Disciplina adicionado com sucesso")
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

                $("#btnSalvar").attr("disabled", "disabled");
                $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);

                var formData = {
                    id: $("#id").val(),
                    nome: $("#nome").val(),
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizaDisciplina",
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
        $('#nome').prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show()
    })

    $('#btnEditar').click(function (){
        $('#formAction').val("edit");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", true );
        $('#nome').prop( "disabled", false );
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
                    url: `/admin/removeDisciplina/${id}`,
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

function getDisciplinaById(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getDisciplinaId/${idBusca}`,
        success: function (response) {
            $('#id').val(response.id);
            $('#nome').val(response.nome);
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
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()
}

function limpaCampos(){
    $('#id').val("");
    $('#nome').val("");
    $('#btnEditar').prop( "disabled", true )
    $('#btnExcluir').prop( "disabled", true );
}

function geraTabela(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Disciplina não encontrada' || response[0].id !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].disciplina_id}</td><td>${response[i].disciplina_nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
}