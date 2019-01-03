$(document).ready(function () {

    if(localStorage.getItem('th_active_game') == null) {
        swal({
            text: 'Nenhum jogo selecionado',
            type: 'warning',
        }).then(() => {
            window.location.href = 'home.html';
        })
    }

    active_game_key = localStorage.getItem('th_active_game');
    active_game = null;
    player1 = player2 = null;

    fd.ref('games/'+active_game_key).once('value', (response) => {
        active_game = response.val();
        fd.ref('player/'+response.val().player1).once('value', (res_player) => {
            player1 = res_player.val();
        }).then(() => {
            fd.ref('player/'+response.val().player2).once('value', (res_player2) => {
                player2 = res_player2.val();
            })
        }).then(() => {
            $('#player_1_stats').html(`
                <div id='player_1_name' style='color: ${player1.primary_color};' class='player_status_name'>${player1.name}</div>
                <div id='player_1_status' class='player_status_image'></div>
            `);

            player2_color = player2.primary_color != player1.primary_color ? player2.primary_color : player2.secondary_color;

            $('#player_2_stats').html(`
                <div id='player_2_name' style='color: ${player2_color};' class='player_status_name'>${player2.name}</div>
                <div id='player_2_status' class='player_status_image'></div>
            `);
            
        })
    }).then( () => {

        th = TreasureHunt(active_game, player1, player2);

        table = th.buildBoard();

        $('#game_div').append(table);
    });



});