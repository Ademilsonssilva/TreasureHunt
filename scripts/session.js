$(document).ready(function () {

    logged_user = '';

    fa.onAuthStateChanged(function(user) {
		  
        if (user) {

            logged_user = firebase.auth().currentUser.uid;

            fd.ref('player/'+logged_user).on('value', (data) => {

                player = data.val();

                $('#player_name_navbar_dropdown').html(player.name);
            })

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

});

function logout() {

    fa.signOut().then( () => {
        window.location.href = 'index.html';
    })

}
  
	