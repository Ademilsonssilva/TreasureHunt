$(document).ready(function () {

    $('#btn_login').on('click', function () {

        email = $('#email').val();
        password = $('#password').val();

        if(email == '' || password == '') {
    
            swal({
                title: 'Ops',
                html: 'Não deixe campos em branco!',
                type: 'warning',
            })
            
            return;
        }

        fa.signInWithEmailAndPassword(email, password).then(() => {
           
            swal({
                html: 'Logado com sucesso',
                type: 'success',
                toast: true,
                timer: 1200,
            });

            window.location.href = 'home.html';
            
        }).catch((error) => {
            switch(error.code) {
                case 'auth/user-not-found':
                    mensagem = 'Email não encontrado';
                    break;
                case 'auth/invalid-email':
                    mensagem = 'Email informado é inválido';
                    break;
                default: 
                    mensagem = 'Não foi possível efetuar o login';
                    break;
            }

            console.log(error.code);

            swal({
                html: mensagem,
                type: 'warning',
                toast: true,
                timer: 2000,
            })
        });

    });


    $('#btn_back').on('click', () => {
        window.location.href = 'index.html';
    });

});