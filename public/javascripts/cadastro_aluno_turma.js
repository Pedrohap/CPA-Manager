let idTurmaGlobal = -1;

$(document).ready(function () {
    //FUNÇÕES DA BARRA DE AUTO COMPLETAR DO DOCENTE, DISCIPLINA E MATRICULA
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
            getTurmasByFiltros()
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

        if($('#idDocente').val() !== ""){
            getTurmasByFiltros();
        }
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
            getTurmasByFiltros();
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


    $('#matriculaAluno').blur(function(){
        getAlunoByID();
    })

    $('#nomeAluno').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getAlunoNome/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabela(response);
                        $('#nomeAlunoBuscaAutoFill').html(html);
                        $('#sugestionTableAluno').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTableAluno').hide();
                }
            })
        }else {
            $('#sugestionTableAluno').hide();
        }
    })


    $('#nomeAluno').blur( function(){
        if ($('#nomeAluno').val() === ''){
            $('#matriculaAluno').val('');
        }
    });

    $("#nomeAlunoBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#nomeAluno').val(nome);
        $('#matriculaAluno').val(id);
        getAlunoByID();
        $('#nomeAlunoBuscaAutoFill').html('');
        $('#sugestionTableAluno').hide();
    });

    $('#matriculaAluno').blur(function(){
        getAlunoByID();
    })

    //FIM DAS FUNÇÕES DA BARRA DE AUTO COMPLETAR DO CURSO, CURRICULO E MATRICULA

    $('#anoFiltro').blur( function () {
        if($('#anoFiltro').val() !== ""){
            getTurmasByFiltros();
        }
    })

    
    $('#semestreFiltro').blur( function () {
        if($('#semestreFiltro').val() !== ""){
            getTurmasByFiltros();
        }
    })

    //FUNÇÃO DE CARREGAR DADOS DA TURMA AO SELECIONAR UM NOME DE TURMA
    $('#nomeTurma').change( function () {
        let idDaTurma = $('#nomeTurma').val();
        if (idDaTurma !== 'none'){
            getTurmaByID(idDaTurma);
            $.ajax({
                type: "GET",
                url: `/admin/getAlunosTurma/${idDaTurma}`,
                success: function (response) {
                    $('#matriculaAluno').prop("disabled",false);
                    $('#nomeAluno').prop("disabled",false);
                    $('#btnMatricularAluno').prop("disabled",false);

                    if (response.length > 0){
                        console.log(response)
                    }
                },
                error: function(response) {
                    console.log(response)
                }
            })
        } else {
            $('#matriculaAluno').prop("disabled",true);
            $('#nomeAluno').prop("disabled",true);
            $('#btnMatricularAluno').prop("disabled",true);

            limpaCampos();
        }
    })
    //FIM

    //MATRICULAR ALUNO
    $("#matriculaAlunoForm").submit(function (e) {
        e.preventDefault();
        console.log(idTurmaGlobal)
        if (idTurmaGlobal !== -1){
            let formData = {
                alunoId: $("#matriculaAluno").val(),
                turmaId: idTurmaGlobal
            }
            $.ajax({
                type: "POST",
                url: `/admin/addAlunoTurma`,
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Aluno matriculado com Sucesso")
                    $('#modal').modal('show')
                    limpaCampos();
                },
                error: function (response){
                    $('#modalLabel').html("Erro");
                    $('#modalTexto').html(response.responseText);
                    $('#modal').modal('show');;
                }
            })
        }
    });
    //
})

function getTurmasByFiltros(){
    let dados = {};

    if ($("#idDiciplina").val() !== ''){
        dados.disciplina = ($("#idDiciplina").val());
    }

    if($("#idDocente").val() !== ''){
        dados.docente = ($("#idDocente").val());
    }

    if($("#anoFiltro").val() !== ''){
        dados.ano = ($("#anoFiltro").val());
    }

    if($("#semestreFiltro").val() !== ''){
        dados.semestre = ($("#semestreFiltro").val());
    }

    $.ajax({
        type: "POST",
        url: `/admin/getTurmaFiltros`,
        data: dados,
        success: function (response) {
            if(response.length > 0){
                geraSelectNomesTumra(response);
            } else {
                $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
            }
        },
        error: function (response){
            $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
        }
    })
}

function geraSelectNomesTumra(response) {
    let optionsList = `<option value="none" selected>Não Selecionada</option>`;
    response.forEach(turma => {
        console.log(turma)
        optionsList += `<option value="${turma.turma_id}">${turma.turma_nome}</option>`
    });

    $('#nomeTurma').html(optionsList);
}

function getDocenteByID(){
    let idBusca = $('#idDocente').val();
    $.ajax({
        type: "GET",
        url: `/admin/getDocenteId/${idBusca}`,
        success: function (response) {
            $('#idDocente').val(response.docente_id);
            $('#nomeDocente').val(response.nome);
            getTurmasByFiltros();
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
            getTurmasByFiltros();
        },
        error: function (response){
            $('#idDiciplina').val("");
            $('#nomeDisciplina').val("");
        }
    })
}

function getTurmaByID(id){
    $.ajax({
        type: "GET",
        url: `/admin/getTurmaId/${id}`,
        success: function (response) {
            idTurmaGlobal = id;
            $('#anoFiltro').val(response.ano);
            $('#semestreFiltro').val(response.semestre);
            $('#idDocente').val(response.idDocente);
            $('#nomeDocente').val(response.nomeDocente);
            $('#idDiciplina').val(response.idDisciplina);
            $('#nomeDisciplina').val(response.nomeDisciplina);
            getAlunosByTurma(id);
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

function limpaCampos(){
    $('#id').val("");
    $('#nome').val("");
    $('#anoFiltro').val("");
    $('#semestreFiltro').val("");
    $('#idDocente').val("");        
    $('#nomeDocente').val("");        
    $('#idDiciplina').val("");        
    $('#nomeDisciplina').val("");
    $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
    $('#matriculaAluno').val("");
    $('#nomeAluno').val("");
    idTurmaGlobal = -1;
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

function getAlunoByID(){
    let idBusca = $('#matriculaAluno').val();

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
            $('#nomeAluno').val('');
            $('#matriculaAluno').val('');
        }
    })
}

function removeAlunoTurma(matricula){
    $('#modalLabelConfirm').html("Alerta de Exclusão")
    $('#modalTextoConfirm').html(`Deseja realmente desmatricular este aluno?`)
    $('#modalBtnConfirmar').removeClass();
    $('#modalBtnConfirmar').addClass('btn btn-danger')
    $('#modalBtnConfirmar').html('Excluir')
    $('#modalConfirm').modal('show')

    $('#modalBtnConfirmar').click( function(){
        $('#modalConfirm').modal('hide')
        let formData = {alunoId: matricula, turmaId: idTurmaGlobal}
        $.ajax({
            type: "POST",
            url: `/admin/removeAlunoTurma`,
            data: formData,
            success: function (response) {
                $('#modalLabel').html("Sucesso")
                $('#modalTexto').html("Aluno desmatriculado com Sucesso")
                $('#modal').modal('show')
                getAlunosByTurma(idTurmaGlobal);
            },
            error: function (response){
                $('#modalLabel').html("Erro");
                $('#modalTexto').html(response.responseText);
                $('#modal').modal('show');;
            }
        })
    })
}

function getAlunosByTurma(turma){
    $('#alunosTurmaAutoFill').html("")
    $.ajax({
        type: "GET",
        url: `/admin/getAlunosTurma/${turma}`,
        success: function (response) {
            if(response.length > 0 && response[0].nome !== undefined){
                let html;
                for (let i = 0 ; i < response.length ; i++){
                    html += `<tr><td>${response[i].id}</td><td>${response[i].nome}</td><td><a class="btn btn-danger btn-sm" onclick="removeAlunoTurma(${response[i].id})">Excluir</a></td></tr>`
                }
                $('#alunosTurmaAutoFill').html(html)
            } else {
                $('#alunosTurmaAutoFill').html("")
            }
        },
        error: function (response){
            $('#alunosTurmaAutoFill').html("")
        }
    })
}
