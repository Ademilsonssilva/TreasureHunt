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
                    <div id='player_1_status' style='color: ${player1.primary_color};' class='player_status_score'></div>
                `);
    
                player2_color = player2.primary_color != player1.primary_color ? player2.primary_color : player2.secondary_color;
    
                $('#player_2_stats').html(`
                    <div id='player_2_name' style='color: ${player2_color};' class='player_status_name'>${player2.name}</div>
                    <div id='player_2_status' style='color: ${player2_color};' class='player_status_score'></div>
                `);
                
            })
        }).then(() => {

            loaded_moves = [];
            loaded_moves_validation = [];
            loaded_moves_array = [];
            fd.ref('games/'+active_game_key+'/moves').once('value', function(moves)  {
                moves.forEach((move) => {
                    loaded_moves.push(move.val());
                    loaded_moves_validation.push(move.key);
                    loaded_moves_array.push(move.val().position);
                })
            }).then( () => {

                th = TreasureHunt(active_game, player1, player2, logged_user);
                th.configureGame();

                $(window).resize(function () {
                    try{
                        th.adjustScreenSize();
                    }
                    catch {}
                })

                th.player1Score = 0;
                th.player2Score = 0;
    
                fd.ref('games/'+active_game_key+'/nextPlayer').on('value', (data) => {
                    th.setNextPlayer(data.val());
                })

                fd.ref('games/'+active_game_key+'/winner').on('value', (data) => {
                    th.game.winner = data.val();
                })
    
                fd.ref('games/'+active_game_key+'/moves').on('child_added', (data) => {
                    if(!loaded_moves_validation.includes(data.key)) {
                        loaded_moves_validation.push(data.key);
                        loaded_moves.push(data.val())
                        loaded_moves_array.push(data.val().position);

                        th.moves = loaded_moves;
                        th.moves_array = loaded_moves_array;

                        th.populateBoard();
                    }

                    if(th.game.treasures.includes(data.val().position)) {
                        if(data.val().player == th.player1Key) {
                            th.player1Score++;
                        }
                        else {
                            th.player2Score++;
                        }

                        th.updateScores();
                    }
                    if(th.playerScore(data.val().player) > parseInt(TREASURE_NUMBER / 2) ) {

                        setTimeout(function () {
                            if(data.val().player == logged_user) {
                                swal({
                                    text: 'Você venceu esta partida!',
                                    type: 'success',
                                    title: 'Vitória',
                                })
                            }
                            else {
                                swal({
                                    text: 'Você perdeu esta partida!',
                                    type: 'error',
                                    title: 'Derrota',
                                })
                            }
                            th.setNextPlayer();
                        }, 1000);
                        
                        
                    }
                })
        
                table = th.buildBoard();
    
                th.moves = loaded_moves;
                th.moves_array = loaded_moves_array
    
                th.populateBoard();
        
                $(document).on('click', '.game-cell', function (clicked) {

                    td = $(clicked.currentTarget);
                    clearInterval(timeOut);

                    if(td.hasClass('holding')) {
                        return false;
                    }
        
                    if(th.getNextPlayer() == logged_user) {
                        position = th.translatePosition(td);

                        hit = th.game.treasures.includes(position);

                        if(!loaded_moves_array.includes(position)) {
                            fd.ref('games/'+active_game_key+'/moves/').push({
                                position: position,
                                player: logged_user,
                                hit: hit,
                            }).then(() => {
                                if (!hit) {
                                    fd.ref('games/'+active_game_key).update({
                                        nextPlayer: th.getOpponentKey(),
                                    }).then(() => {
                                        
                                    })
                                }
                                else {
                                    th.setNextPlayer(null);
                                    
                                    swal({
                                        toast: true,
                                        position: 'top-end',
                                        text: 'acertou!',
                                        timer: 1200,
                                    })

                                    if(th.playerScore(logged_user) > parseInt(TREASURE_NUMBER / 2)) {
                                        fd.ref('games/'+active_game_key).update({
                                            nextPlayer: null,
                                            gameEnd: firebase.database.ServerValue.TIMESTAMP,
                                            winner: logged_user,
                                            gameStatus: 'finished',
                                        }).then(function () {
                                            fd.ref('player_invites/'+th.player1Key+'/invites/'+active_game_key).set({}).then(function () {
                                                fd.ref('player_invites/'+th.player2Key+'/invites/'+active_game_key).set({}).then(function () {
                                                    th.setNextPlayer(null);
                                                    /*swal({
                                                        text: 'Você venceu!',
                                                        type: 'success',
                                                        title: 'Vitória',
                                                    }).then(function () {
                                                        //window.location.href = 'home.html';
                                                    })*/
                                                })
                                            })
                                        })
                                    }
                                    else {
                                        th.setNextPlayer(logged_user);
                                    }
                                }
                                
                            })
                        }
                        
                    }
                    else {
                        swal({
                            type: 'warning',
                            toast: true,
                            position: 'top-end',
                            text: 'É vez do oponente jogar!',
                            timer: 1000,
                        })
                    }
        
                }) 
                
                $(document).on('mousedown touchstart', '.game-cell', function(e) {
                    
                    $('.holding').removeClass('holding');
                    counter = 0;
                    timeout = 0;
                    try {
                        clearInterval(timeOut);
                    }
                    catch(e){}
                    
                    timeOut = setInterval(function(){
                        counter++;

                        if(counter == 7 ) {
                            if($(e.currentTarget).hasClass('highlighted_position_selected')) {
                                clearInterval(timeOut);
        
                                $('.highlighted_position').removeClass('highlighted_position');
                                $('.highlighted_position_selected').removeClass('highlighted_position_selected');

                                $(e.currentTarget).addClass('holding');
                                return false;
                            }
                        }

                        if(counter == 12) {
                            
                            $('.highlighted_position').removeClass('highlighted_position');
                            $('.highlighted_position_selected').removeClass('highlighted_position_selected');
                            $(e.currentTarget).addClass('highlighted_position_selected');
                            neighbors = th.getPositionNeighborhood(th.translatePosition($(e.currentTarget)));

                            for(nb = 0; nb < neighbors.length; nb++) {
                                $('#' + th.translateDBPosition(neighbors[nb])).addClass('highlighted_position');
                            }
                            $(e.currentTarget).addClass('holding');
                        }
                    }, 100);
                });
        
            });
        })
        
        
    })



});