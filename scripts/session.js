$(document).ready(function () {

    logged_user = '';

    fa.onAuthStateChanged(function(user) {
		  
        if (user) {

            logged_user = firebase.auth().currentUser.uid;

            fd.ref('player/'+logged_user).on('value', (data) => {

                player = data.val();

                $('#player_name_navbar_dropdown').html(player.name);
            });

            fa.onAuthStateChanged(function(user) {

                var uid = firebase.auth().currentUser.uid;
                var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
        
                var isOfflineForDatabase = {
                    state: 'offline',
                    last_changed: firebase.database.ServerValue.TIMESTAMP,
                };
        
                var isOnlineForDatabase = {
                    state: 'online',
                    last_changed: firebase.database.ServerValue.TIMESTAMP,
                };
        
                firebase.database().ref('.info/connected').on('value', function(snapshot) {
        
                    if (snapshot.val() == false) {
                        return;
                    };
        
                    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                        userStatusDatabaseRef.set(isOnlineForDatabase);
                    });
                });
            });

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
  
	