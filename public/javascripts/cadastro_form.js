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
            getTurmasByFiltros();
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
            $('#sugestionTableDisciplina').hide();
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

    $('#idForm').blur(function(){
        if($('#idForm').val() !== ""){
            getFormById($('#idForm').val());
        }
    })

    $('#nomeForm').on('input',function(){
        var searchTerm = $(this).val();

        if (searchTerm.length >= 4) {
            $.ajax({
                type: "GET",
                url: `/admin/getFormularioNomeParc/${searchTerm}`,
                success: function (response) {

                    if (response.length > 0){
                        let html = geraTabelaForm(response);
                        $('#nomeFormBuscaAutoFill').html(html);
                        $('#sugestionTableForm').show();
                    }
                },
                error: function(response) {
                    console.log(response)
                    $('#sugestionTableForm').hide();
                }
            })
        }else {
            $('#sugestionTableForm').hide();
        }
    })

    $("#nomeFormBuscaTable").on("click", "tr", function() {
        let id = $(this).find("td:eq(0)").text();
        let nome = $(this).find("td:eq(1)").text();
        $('#idForm').val(id);
        $('#nomeForm').val(nome);
        getFormById(id);
        $('#nomeFormBuscaAutoFill').html('');
        $('#sugestionTableForm').hide();
    });

    //FIM DAS FUNÇÕES DA BARRA DE AUTO COMPLETAR DO CURSO, CURRICULO E MATRICULA

    $('#anoFiltro').blur( function () {
        getTurmasByFiltros();
    })

    
    $('#semestreFiltro').blur( function () {
        getTurmasByFiltros();
    })

    //FUNÇÃO DE CARREGAR DADOS DA TURMA AO SELECIONAR UM NOME DE TURMA
    $('#nomeTurma').change( function () {
        let idDaTurma = $('#nomeTurma').val();
        if (idDaTurma !== 'none'){
            getTurmaByID(idDaTurma);
            $('#nomeForm').prop("disabled",true);
            $('#idForm').prop("disabled",true);
            $('#sitForm').prop("disabled",true);
            setTimeout(function() {
                let formData = {
                    semestre: $('#semestreFiltro').val(),
                    ano: $('#anoFiltro').val(),
                    disciplina: $('#idDiciplina').val(),
                    turma: $('#nomeTurma').val()
                }
                console.log(formData)
                $.ajax({
                    type: "POST",
                    url: `/admin/getFormularioFiltros`,
                    data: formData,
                    success: function (response) {
                        if (response.length === 1){
                            $('#nomeForm').val(response[0].form_nome);
                            $('#idForm').val(response[0].form_id);
                            $('#removeFormModalBtn').prop("disabled",false)
                            $('#AddQuestFormModalBtn').prop("disabled",false)
                            if(response[0].is_open){
                                $('#sitForm').val("Aberto");
                            } else {
                                $('#sitForm').val("Fechado");
                            }
                            getQuestoesDoForm();
                        } else {
                            $('#nomeForm').val("");
                            $('#idForm').val("");
                            $('#sitForm').val("");
                            $('#listaQuestoes').html("");
                            $('#nomeForm').prop("disabled",false);
                            $('#idForm').prop("disabled",false);
                            $('#removeFormModalBtn').prop("disabled",true);
                            $('#AddQuestFormModalBtn').prop("disabled",true);
                        }
                    }
                })
            },250);

            //Carregar questões
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

    //Criação de formulario
    $("#criarFormModalBtn").on("click", ()=>{
        $('#turmasID').html("");
        getAllTurmas();
    });

    $("#cadastrarFormularioForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            turma_id: $('#turmasID').val(),
            form_nome: $('#nomeFormCreate').val()
        }

        $.ajax({
            type: "POST",
            url: `/admin/cadastrarFormulario`,
            data: formData,
            success: function (response) {
                $('#modalLabel').html("Sucesso")
                $('#modalTexto').html("Formulario matriculado com Sucesso")
                $('#modal').modal('show')
                limpaCampos();
            },
            error: function (response){
                $('#modalLabel').html("Erro");
                $('#modalTexto').html(response.responseText);
                $('#modal').modal('show');;
            }
        })
    });

    $("#removeFormModalBtn").on("click", ()=>{
        let formData = {
            id: $('#idForm').val()
        }
        if(formData.id != ""){
            $('#modalLabelConfirm').html("Alerta de Exclusão")
            $('#modalTextoConfirm').html(`Deseja realmente excluir o formulario ${$('#nomeForm').val()}?`)
            $('#modalBtnConfirmar').removeClass();
            $('#modalBtnConfirmar').addClass('btn btn-danger')
            $('#modalBtnConfirmar').html('Excluir')
            $('#modalConfirm').modal('show')
            
            $('#modalBtnConfirmar').click( function(){
                $('#modalConfirm').modal('hide')

                $.ajax({
                    type: "POST",
                    url: `/admin/removeFormulario/`,
                    data: formData,
                    success: function (response) {
                        $('#modalLabel').html("Sucesso")
                        $('#modalTexto').html("Formulario excluida com Sucesso")
                        $('#modal').modal('show')
                        limpaCampos();
                    },
                    error: function (response){
                        $('#modalLabel').html("Erro");
                        $('#modalTexto').html(response.responseText);
                        $('#modal').modal('show');;
                    }
                })
            })
        }
    });

    //Funções da Questão
    $("#cadastraQuestaoModal").submit(function (e) {
        e.preventDefault();

        if ($('#idForm').val() !== ""){
            let formData = {
                formId: $('#idForm').val(),
                questaTipo: $('#tipoQuestaoCreate').val(),
                questaoPergunta: $('#perguntaQuestaoCreate').val()
            }

            $.ajax({
                type: "POST",
                url: `/admin/cadastrarQuestao`,
                data: formData,
                success: function (response) {
                    $('#modalLabel').html("Sucesso")
                    $('#modalTexto').html("Questão adicionadas com Sucesso")
                    $('#modal').modal('show')
                    getQuestoesDoForm();
                },
                error: function (response){
                    $('#modalLabel').html("Erro");
                    $('#modalTexto').html(response.responseText);
                    $('#modal').modal('show');;
                }
            })
        }
    })


})

function getFormById(id){
    $.ajax({
        type: "GET",
        url: `/admin/getFormId/${id}`,
        success: function (response) {
            $('#anoFiltro').val(response.ano);
            $('#semestreFiltro').val(response.semestre);
            $('#idDocente').val(response.id_docente);        
            $('#nomeDocente').val(response.nome_docente);        
            $('#idDiciplina').val(response.id_disciplina);        
            $('#nomeDisciplina').val(response.nome_disciplina);
            $('#idForm').val(response.form_id);
            $('#nomeForm').val(response.form_nome);
            if(response.is_open){
                $('#sitForm').val("Aberto");
            } else {
                $('#sitForm').val("Fechado");
            }
            $('#nomeFormCreate').val("");
            $('#perguntaQuestaoCreate').val("");
            $('#nomeTurma').html(`<option value="${response.turma_id}" selected>${response.nome_turma}</option>`);
            $('#idForm').prop( "disabled", true );
            $('#nomeForm').prop( "disabled", true );
            $("#removeFormModalBtn").prop( "disabled", false );
            $('#AddQuestFormModalBtn').prop( "disabled", false );
            getQuestoesDoForm();
        }
    })
}

function getQuestoesDoForm(){
    let cards = "";
    if ($('#idForm').val() !== ""){
        let idForm = $('#idForm').val();
        $.ajax({
            type: "GET",
            url: `/admin/getQuestaoByForm/${idForm}`,
            success: function (response) {
                console.log(response)
                if(response !== 'Nenhuma questão não encontrada'){
                    for (let i = 0; i < response.length ; i++){
                        cards += `                
                        <div class="card cardCustom mb-4">
                            <div class="card-body">
                            <h5 class="card-title">${response[i].questao_pergunta}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Tipo: ${response[i].questao_tipo}</h6>
                            </div>
                            
                            <div class="card-footer text-body-secondary">
                                <button class="btn btn-success me-3">Ver Respostas</button>
                                <button class="btn btn-danger" onclick="removeQuestaoForm(${response[i].questao_id})">Excluir Pergunta</button>
                            </div>
                        </div>
                    `
                    }
                    $('#listaQuestoes').html(cards);
                } else{
                    $('#listaQuestoes').html("");
                }
            },
            error: function (response){
                $('#listaQuestoes').html("");
            }
        })
    }
}

function removeQuestaoForm(idQuestao){
    $('#modalLabelConfirm').html("Alerta de Exclusão")
    $('#modalTextoConfirm').html(`Deseja realmente excluir o esta questão?`)
    $('#modalBtnConfirmar').removeClass();
    $('#modalBtnConfirmar').addClass('btn btn-danger')
    $('#modalBtnConfirmar').html('Excluir')
    $('#modalConfirm').modal('show')
    
    $('#modalBtnConfirmar').click( function(){
        $('#modalConfirm').modal('hide')

        $.ajax({
            type: "POST",
            url: `/admin/removeQuestao/${idQuestao}`,
            success: function (response) {
                $('#modalLabel').html("Sucesso")
                $('#modalTexto').html("Questão excluida com Sucesso")
                $('#modal').modal('show')
                limpaCampos();
            },
            error: function (response){
                $('#modalLabel').html("Erro");
                $('#modalTexto').html(response.responseText);
                $('#modal').modal('show');;
            }
        })
    })
}

function getAllTurmas(){
    let dados;
    $.ajax({
        type: "POST",
        url: `/admin/getTurmaFiltros`,
        data: dados,
        success: function (response) {
            if(response.length > 0){
                geraSelectNomesTumraCreateForm(response);
            } else {
                $('#turmasID').html(`<option value="none" selected>Não Selecionada</option>`);
            }
        },
        error: function (response){
            $('#turmasID').html(`<option value="none" selected>Não Selecionada</option>`);
        }
    })
}

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
    $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
    $('#listaQuestoes').html("");
    $("#removeFormModalBtn").prop( "disabled", true );
    $('#AddQuestFormModalBtn').prop( "disabled", true );
    $('#nomeForm').val("");
    $('#idForm').val("");
    $('#sitForm').val("");
    $('#listaQuestoes').html("");
    $('#nomeForm').prop("disabled",false);
    $('#idForm').prop("disabled",false);
    
    $.ajax({
        type: "POST",
        url: `/admin/getTurmaFiltros`,
        data: dados,
        success: function (response) {
            if(response.length > 0 && response !== "Turma não encontrado"){
                geraSelectNomesTumra(response);
            } else {
                $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
                $('#listaQuestoes').html("");
                $("#removeFormModalBtn").prop( "disabled", true );
                $('#AddQuestFormModalBtn').prop( "disabled", true );
                $('#nomeForm').val("");
                $('#idForm').val("");
                $('#sitForm').val("");
                $('#listaQuestoes').html("");
                $('#nomeForm').prop("disabled",false);
                $('#idForm').prop("disabled",false);
            }
        },
        error: function (response){
            $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
            $('#listaQuestoes').html("");
            $("#removeFormModalBtn").prop( "disabled", true );
            $('#AddQuestFormModalBtn').prop( "disabled", true );
            $('#nomeForm').val("");
            $('#idForm').val("");
            $('#sitForm').val("");
            $('#listaQuestoes').html("");
            $('#nomeForm').prop("disabled",false);
            $('#idForm').prop("disabled",false);
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

function geraSelectNomesTumraCreateForm(response) {
    let optionsList = ``;
    response.forEach(turma => {
        console.log(turma)
        optionsList += `<option value="${turma.turma_id}">${turma.turma_nome}</option>`
    });

    $('#turmasID').html(optionsList);
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
    $('#idForm').val("");
    $('#nomeForm').val("");
    $('#sitForm').val("");
    $('#nomeFormCreate').val("");
    $('#perguntaQuestaoCreate').val("");
    $('#nomeTurma').html(`<option value="none" selected>Não Selecionada</option>`);
    $('#idForm').prop( "disabled", false );
    $('#nomeForm').prop( "disabled", false );
    $("#removeFormModalBtn").prop( "disabled", true );
    $('#AddQuestFormModalBtn').prop( "disabled", true );
    $('#listaQuestoes').html('');
    idTurmaGlobal = -1;
}

function geraTabelaForm(response){
    let html;
    let maxLenght = 8;
    if (maxLenght > response.length){
        maxLenght = response.length
    }

    if (response != 'Docente não encontrado' || response[0].id !== undefined){
        for (let i = 0 ; i < maxLenght ; i++){
            html += `<tr><td>${response[i].form_id}</td><td>${response[i].form_nome}</td></tr>`
        }
    } else{
        html = "";
    }

    return html;
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