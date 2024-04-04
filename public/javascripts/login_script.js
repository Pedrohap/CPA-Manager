$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        $('#alert').html("")
        e.preventDefault(); // Impede o envio tradicional do formulário
        // Obtém os dados do formulário
        var formData = {
            login: $("#login").val(),
            senha: $("#senha").val()
        };
        //Desabilita o botão e muda o texto
        $("#btn-submit").attr("disabled", "disabled");
        $("#btn-submit").html(`<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Tentando Login...</span>`);

        // Realiza a requisição AJAX
        $.ajax({
            type: "POST",
            url: "/login", // Rota correspondente no seu servidor
            data: formData,
            success: function (response) {
                // Verifica se a resposta do servidor indica um login bem-sucedido
                if (response.status === 'Login bem-sucedido!') {
                    if (response.acesso === 'admin'){
                        window.location.href = "/admin";
                    }
                } else {
                    $("#alert").html(`
                    <div id="alert-wrong-cridential" class="alert alert-warning alert-dismissible fade show" role="alert">
                        ${response}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    `);
    
                    //Reabilita o botão
                    $("#btn-submit").removeAttr("disabled").html("Fazer Login");
                }
            },
            error: function (response){
                $("#alert").html(`
                <div id="alert-wrong-cridential" class="alert alert-warning alert-dismissible fade show" role="alert">
                    Erro de servidor.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `);

                //Reabilita o botão
                $("#btn-submit").removeAttr("disabled").html("Fazer Login");
            }
        });
    });
});