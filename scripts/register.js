$(document).ready(function () {

    default_color_1 = avaliableColors[Math.floor(Math.random()*avaliableColors.length)];

    passed = false;
    while (!passed) {
        default_color_2 = avaliableColors[Math.floor(Math.random()*avaliableColors.length)];

        if(default_color_2 != default_color_1) {
            passed = true;
        }
    }

    $('#primary_color_div').html(getColorsSelector('primary_color', default_color_1));
    $('#secondary_color_div').html(getColorsSelector('secondary_color'));

    $('#btn_register').on('click', function () {

        name = $('#name').val();
        email = $('#email').val();
        pass = $('#password').val();
        primary_color = $('#primary_color').val();
        secondary_color = $('#secondary_color').val();

        if(primary_color == secondary_color) {
            swal({
                title: 'Ops',
                html: 'As cores devem ser diferentes!',
                type: 'warning',
            })

            return;
        }

        if(email == '' || pass == '' || name == '') {
    
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
                primary_color: primary_color,
                secondary_color: secondary_color,
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

    $('#btn_back').on('click', function () {
        window.location.href = 'index.html';
    })


})