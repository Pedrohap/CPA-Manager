$(document).ready(function () {
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()

    $('#btnCancelar').click(function(){
        limpaCampos();
        disableForm();
        $('#btnSalvar').hide();
        $('#btnCancelar').hide();
        $('#btnNovo').prop( "disabled", false );
    })

    //FUNÇÕES DA BARRA DE AUTO COMPLETAR
    $('#idBusca').blur(function(){
        $('#idBusca').val($('#idBusca').val().toUpperCase())
        getCursoBySigla();
    })

    $("#nomeBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idBusca').val(id);
        $('#nomeBusca').val(nome);
        getCursoBySigla();
        $('#nomeBuscaAutoFill').html('');
        $('#sugestionTable').hide();
    });

    $('#nomeBusca').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getCursoNome/${searchTerm}`,
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

    $("#createCursoForm").submit(function (e) {
        e.preventDefault();

        if ($('#formAction').val() === 'new'){

            $("#btnSalvar").attr("disabled", "disabled");
            $("#btnSalvar").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Salvando...</span>`);

            var formData = {
                sigla: $("#sigla").val(),
                nome: $("#nome").val(),
            };

            $.ajax({
                type: "POST",
                url: "/admin/cadastrarCurso",
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Curso criado com sucesso")
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
                    id: $("#id").val(),
                    sigla: $("#sigla").val(),
                    nome: $("#nome").val()
                };
                $.ajax({
                    type: "POST",
                    url: "/admin/atualizaCurso",
                    data: formData,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Curso atualizado com sucesso")
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
        $("#sigla").prop( "disabled", false );
        $("#nome").prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show();
    })

    $('#btnEditar').click(function (){
        $('#formAction').val("edit");
        $('#btnNovo').prop( "disabled", true );
        $('#id').prop( "disabled", true );
        $("#sigla").prop( "disabled", false );
        $("#nome").prop( "disabled", false );
        $("#btnSalvar").removeAttr("disabled").html("Salvar");
        $('#btnSalvar').show();
        $('#btnCancelar').show();
    })

    $('#btnExcluir').click(function (){
        if($('#id').val()!= ""){
            $('#modalLabelConfirm').html("Alerta de Exclusão")
            $('#modalTextoConfirm').html(`Deseja realmente excluir o curso de ${$('#nome').val()}?`)
            $('#modalBtnConfirmar').removeClass();
            $('#modalBtnConfirmar').addClass('btn btn-danger')
            $('#modalBtnConfirmar').html('Excluir')
            $('#modalConfirm').modal('show')
            
            $('#modalBtnConfirmar').click( function(){
                $('#modalConfirm').modal('hide')
                let formData = {id: $('#id').val()}
                $.ajax({
                    type: "POST",
                    url: `/admin/removeCurso`,
                    data: formData,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Curso excluido com Sucesso")
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

    $("#createCurriculoForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            idCurso: $("#id").val(),
            nomeCurriculo: $("#nomeCurriculo").val()
        }
        $.ajax({
            type: "POST",
            url: `/admin/criarCurriculo`,
            data: formData,
            success: function (response) {
                $('#modalLabel').html("Sucesso")
                $('#modalTexto').html("Curriculo adicionado com Sucesso")
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
    });

    
})

function getCursoBySigla(){
    let idBusca = $('#idBusca').val();

    $.ajax({
        type: "GET",
        url: `/admin/getCursoSigla/${idBusca}`,
        success: function (response) {
            if(response !== "Curso não encontrado"){
                $('#id').val(response.id);
                $('#sigla').val(response.sigla);
                $('#nome').val(response.nome);
                $('#nomeBusca').val(response.nome);
                $('#btnEditar').prop( "disabled", false )
                $('#btnExcluir').prop( "disabled", false );
                getCurriculosByCurso(response.id);
                liberaAddCurriculo();
            } else {
                limpaCampos();
            }
        },
        error: function (response){
            limpaCampos();
            $('#btnEditar').prop( "disabled", true )
            $('#btnExcluir').prop( "disabled", true );

        }
    })
}

function getCurriculosByCurso(curso){
    $('#curriculosAutoFill').html("")
    $.ajax({
        type: "GET",
        url: `/admin/getCurriculos/${curso}`,
        success: function (response) {
            if(response.length > 0 && response[0].curriculo_nome !== undefined){
                let html;
                for (let i = 0 ; i < response.length ; i++){
                    html += `<tr><td>${response[i].curriculo_nome}</td><td><a class="btn btn-danger btn-sm" onclick="removeCurriculo(${response[i].curriculo_id},${$('#id').val()})">Excluir</a></td></tr>`
                }
                $('#curriculosAutoFill').html(html)
            } else {
                $('#curriculosAutoFill').html("")
            }
        },
        error: function (response){
            $('#curriculosAutoFill').html("")
        }
    })
}


function disableForm(){
    $('#id').prop( "disabled", true );
    $('#sigla').prop( "disabled", true );
    $('#nome').prop( "disabled", true );
    $('#btnSalvar').hide()
    $('#btnCancelar').hide()
}

function limpaCampos(){
    $('#id').val("");
    $('#idBusca').val("");
    $('#sigla').val("");
    $('#nome').val("");
    $('#nomeBusca').val("");
    $('#idBusca').val("");
    $('#curriculosAutoFill').html("")
    $('#btnEditar').prop( "disabled", true );
    $('#btnExcluir').prop( "disabled", true );
    $('#nomeCurriculo').prop( "disabled", true );
    $('#btnSalvarCuriculo').prop( "disabled", true );
}

function geraTabela(response){
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

function liberaAddCurriculo(){
    $('#nomeCurriculo').prop( "disabled", false );
    $('#btnSalvarCuriculo').prop( "disabled", false );
}

function removeCurriculo(idCurriculo,idCurso){
    $('#modalLabelConfirm').html("Alerta de Exclusão")
    $('#modalTextoConfirm').html(`Deseja realmente excluir este curriculo?`)
    $('#modalBtnConfirmar').removeClass();
    $('#modalBtnConfirmar').addClass('btn btn-danger')
    $('#modalBtnConfirmar').html('Excluir')
    $('#modalConfirm').modal('show')

    $('#modalBtnConfirmar').click( function(){
        $('#modalConfirm').modal('hide')
        let formData = {idCurriculo: idCurriculo}
        $.ajax({
            type: "POST",
            url: `/admin/removeCurriculo`,
            data: formData,
            success: function (response) {
                $('#modalLabel').html("Sucesso")
                $('#modalTexto').html("Curriculo excluido com Sucesso")
                $('#modal').modal('show')
                getCurriculosByCurso(idCurso);
            },
            error: function (response){
                $('#modalLabel').html("Erro");
                $('#modalTexto').html(response.responseText);
                $('#modal').modal('show');;
            }
        })
    })
}