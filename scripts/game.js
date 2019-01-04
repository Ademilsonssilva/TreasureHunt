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
        }).then(() => {

            loaded_moves = [];
            loaded_moves_validation = [];
            fd.ref('games/'+active_game_key+'/moves').once('value', function(moves)  {
                moves.forEach((move) => {
                    loaded_moves.push(move.val());
                    loaded_moves_validation.push(move.key);
                })
            }).then( () => {

                th = TreasureHunt(active_game, player1, player2, logged_user);
                th.configureGame();
    
                fd.ref('games/'+active_game_key+'/nextPlayer').on('value', (data) => {
                    th.setNextPlayer(data.val());
                })
    
                fd.ref('games/'+active_game_key+'/moves').on('child_added', (data) => {
                    if(!loaded_moves_validation.includes(data.key)) {
                        loaded_moves_validation.push(data.key);
                        loaded_moves.push(data.val())

                        th.moves = loaded_moves;

                        th.populateBoard()
                    }
                })
        
                table = th.buildBoard();
    
                th.moves = loaded_moves;
    
                th.populateBoard();
        
                $(document).on('click', '.game-cell', function (clicked) {
                    td = $(clicked.currentTarget);
        
                    if(th.getNextPlayer() == logged_user) {
                        position = th.translatePosition(td);
        
                        hit = true;
    
                        td.html('X');
        
                        fd.ref('games/'+active_game_key+'/moves/').push({
                            position: position,
                            player: logged_user,
                            hit: hit,
                        }).then(() => {
                            fd.ref('games/'+active_game_key).update({
                                nextPlayer: th.getOpponentKey(),
                            }).then(() => {
                                
                            })
                        })
        
        
                    }
                    else {
                        alert('nao é sua vez');
                    }
        
                })
        
            });
        })
        
        
    })



});