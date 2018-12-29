$(document).ready(function () {

    logged_user = '';

    firebase.auth().onAuthStateChanged(function(user) {
		  
        if (user) {

            logged_user = firebase.auth().currentUser.uid;

        } else {
         
            swal({
                toast: true,
                timer: 1500,
                type: 'warning',
                html: 'Faça o login para prosseguir!',
                onClose: () => {
                    window.location.href = 'index.html';
                }
            })
            
        }

    });
})
  
	