$(document).ready(function () {

    $('#btn_register').on('click', function () {

        email = $('#email').val();
        pass = $('#password').val();

        if(email == '' || pass == '') {
    
            swal({
                title: 'Ops',
                html: 'Não deixe campos em branco!',
                type: 'warning',
            })
            
            return;
        }

        user = firebase.auth().createUserWithEmailAndPassword(email, pass).then(function () {

            swal({
                html: 'Usuário cadastrado com sucesso!',
                type: 'success',
                toast: true,
                timer: 2500,
                onClose: () => {
                    //window.location.href = 'home.html';
                }
            });
            
            
            var uid = firebase.auth().currentUser.uid;
            
            firebase.database().ref('player/' + uid ).set({
                name: $('#name').val(),
                email: email,
            });
            
    
        }).catch(function(error) {
            
            message = '';
    
            console.info(error.message);
            console.info(error.code);
    
            switch(error.code) {
                case 'auth/email-already-in-use': 
                    message = 'O email informado já existe';
                    break;
                case 'auth/weak-password':
                    message = 'A senha deve ter pelo menos 6 caracteres';
                    break;
                case 'auth/invalid-email':
                    message = 'O email informado não é válido';
                    break;
                default: 
                    message = 'Ocorreu um erro inesperado!';
                    break;
            }
    
            swal({
                title: 'Ops',
                html: message,
                type: 'warning',	
            });
    
        });			
    

    });


})