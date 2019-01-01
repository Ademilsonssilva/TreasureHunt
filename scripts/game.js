$(document).ready(function () {

    if(localStorage.getItem('th_active_game') == null) {
        swal({
            text: 'Nenhum jogo selecionado',
            type: 'warning',
        }).then(() => {
            window.location.href = 'home.html';
        })
    }



});