$(document).ready(() => {

    $(document).on('click', '.invite_status', (clicked) => {

        target = $(clicked.currentTarget);

        id = target.prop('id');

        if(target.hasClass('invite_player')) {

            invite_object = {
                player: logged_user,
                invited: target.attr('player_key'),
                datetime: firebase.database.ServerValue.TIMESTAMP,
                invite_status: 'pending',
            }

            fd.ref('player_invites/'+logged_user+'/invites/').push(invite_object).then((first_invite) => {
                
                fd.ref('player_invites/'+target.attr('player_key')+'/invites/'+first_invite.key).set(invite_object);
            });
        }
        /*else if(target.hasClass('already_invited')) {
            fd.ref('player_invites/'+logged_user+'/invites/'+target.attr('invite_key')).set({});
            fd.ref('player_invites/'+target.attr('player_key')+'/invites/'+target.attr('invite_key')).set({});         
        }*/
        else if(target.hasClass('accept_invite')) {
            player_id = '';
            invite_id = '';
            fd.ref('player_invites/'+logged_user+'/invites/'+target.attr('invite_key')).once('value', (response) => {
                player_id = response.val().player;
                invite_id = response.key;

                treasures = randomizeTreasures(TABLE_SIZE, TREASURE_NUMBER);

                next_player = Math.floor(Math.random()*2)

                fd.ref('games/'+target.attr('invite_key')).set({
                    player1: response.val().player,
                    player2: response.val().invited,
                    gameStatus: 'playing',
                    gameStart: firebase.database.ServerValue.TIMESTAMP,
                    winner: null,
                    treasures: treasures,
                    nextPlayer: next_player == 1 ? response.val().player : response.val().invited,
                });

            }).then(() => {
                fd.ref('status/'+player_id).once('value', (response) => {
                    state = response.val().state;
                }).then(() => {
                    if(state == 'online') {
                        fd.ref('player_invites/'+logged_user+'/invites/'+target.attr('invite_key')).update({invite_status: 'starting'}).then(() => {
                            fd.ref('player_invites/'+target.attr('player_key')+'/invites/'+target.attr('invite_key')).update({invite_status: 'starting'}).then(() => {
                                localStorage.setItem('th_active_game', invite_id);
                                window.location.href = 'game.html';
                            });
                        });
                    }
                    else {
                        fd.ref('player_invites/'+logged_user+'/invites/'+target.attr('invite_key')).update({invite_status: 'playing'}).then(() => {
                            fd.ref('player_invites/'+target.attr('player_key')+'/invites/'+target.attr('invite_key')).update({invite_status: 'playing'}).then(() => {
                                localStorage.setItem('th_active_game', invite_id);
                                window.location.href = 'game.html';
                            });
                        });
                    }
                })
            });

        }
        else if(target.hasClass('play_game')) {
            invite_id = target.attr('invite_key');
            localStorage.setItem('th_active_game', invite_id);
            window.location.href = 'game.html';
        }
    });

    fd.ref('player').on('value', (players) => {

        pdiv = $('#players_div');
        pdiv.html('');

        players.forEach((player) => {
        
            if(player.key != logged_user) {

                div = $(`<div class="home_player_row row" pid="${player.key}"></div>`);

                col1 = $('<div class="col-7 left"> </div>');
                col2 = $('<div class="col-5 right"> </div>');

                span = $(`<span class="home_player_span"> ${player.val().name} </span>`);
                span.append(`<span class="status-${player.key}" style="color: red;">offline</span>`);

                invite_button = $(`<btn class="invite_status invite_player btn btn-sm btn-success btn-style-1 btn_player_${player.key}" player_key="${player.key}" id="player_${player.key}"> Convidar </button>`);
                
                col1.append(span);
                col2.append(invite_button);

                pdiv.append(div.append(col1).append(col2));

            }

        })
    })
        
    fd.ref('status/').once('value', function (status) {
        //playerState = status;
        status.forEach((playerState) => {
            spanstate = $(`.status-${playerState.key}`);

            state = playerState.val().state;

            color = state == 'online' ? 'green' : 'red';

            spanstate.html(state).css('color', color);
        });

    }).then(() => {
        fd.ref('status/').on('child_changed', function (status) {
            playerState = status;
            //status.forEach((playerState) => {
                spanstate = $(`.status-${playerState.key}`);
    
                state = playerState.val().state;
    
                color = state == 'online' ? 'green' : 'red';
    
                spanstate.html(state).css('color', color);
            //});
    
        })
    }).then(function () {

        fd.ref('player_invites/'+logged_user+'/invites/').on('value', (response) => {

            cleanButtons();
    
            response.forEach((invite) => {
    
                invite_status = '';
    
                if(invite.val().player == logged_user) {
                    invite_status = 'inviting';
                    target = $(`.btn_player_${invite.val().invited}`);
                }
                else if (invite.val().invited == logged_user) {
                    invite_status = 'invited';
                    target = $(`.btn_player_${invite.val().player}`);
                }
                
                if(invite_status != '') {
                    if(invite.val().invite_status == 'playing') {
                        invite_status = 'play';
                    }
                    if(invite.val().invite_status == 'starting' && invite.val().player == logged_user)  {
                        fd.ref('player/'+invite.val().invited).once('value', (response) => {
                            swal({
                                html: response.val().name + ' aceitou o convite! Ir para o jogo?',
                                type: 'success',
                                showCancelButton: true,
                                confirmButtonText: 'Ir',
                                cancelButtonText: 'Ficar',
                            }).then( (result) => {
                                fd.ref('player_invites/'+logged_user+'/invites/'+target.attr('invite_key')).update({invite_status: 'playing'}).then(() => {
                                    fd.ref('player_invites/'+invite.val().invited+'/invites/'+target.attr('invite_key')).update({invite_status: 'playing'}).then(() => {
                                        if(result.value) {
                                            localStorage.setItem('th_active_game', invite.key);
                                            window.location.href = 'game.html';
                                        }
                                    })
                                });      
                            })
                        })
                    }
                }
    
                target.removeClass('invite_player').removeClass('accept_invite').removeClass('already_invited');
                if(invite_status == 'inviting') {
                    target.html('Aguardando');
                    target.addClass('already_invited');
                    target.attr('invite_key', invite.key);
                }
                else if (invite_status == 'invited') {
                    target.html('Aceitar');
                    target.addClass('accept_invite');
                    target.attr('invite_key', invite.key);
                }
                else if( invite_status == 'play') {
                    target.html('Jogar');
                    target.addClass('play_game');
                    target.attr('invite_key', invite.key);
                }
            })
        })

    })

    /*fd.ref('player_invites/'+logged_user+'/invites/').on('value', (response) => {

        cleanButtons();

        console.log(response.val())

        response.forEach((invite) => {

            console.log(invite);

            invite_status = '';

            if(invite.val().player == logged_user) {
                invite_status = 'inviting';
                target = $(`.btn_player_${invite.val().invited}`);
            }
            else if (invite.val().invited == logged_user) {
                invite_status = 'invited';
                target = $(`.btn_player_${invite.val().player}`);
            }
            
            if(invite_status != '') {
                if(invite.val().invite_status == 'playing') {
                    invite_status = 'play';
                }
                if(invite.val().invite_status == 'starting' && invite.val().player == logged_user)  {
                    fd.ref('player/'+invite.val().invited).once('value', (response) => {
                        swal({
                            html: response.val().name + ' aceitou o convite! Ir para o jogo?',
                            type: 'success',
                            showCancelButton: true,
                            confirmButtonText: 'Ir',
                            cancelButtonText: 'Ficar',
                        }).then( (result) => {
                            fd.ref('invites/'+target.attr('invite_key')).update({invite_status: 'playing'}).then(() => {
                                if(result.value) {
                                    localStorage.setItem('th_active_game', invite.key);
                                    window.location.href = 'game.html';
                                }
                            });      
                        })
                    })
                }
            }

            target.removeClass('invite_player').removeClass('accept_invite').removeClass('cancel_invite');
            if(invite_status == 'inviting') {
                target.html('Cancelar');
                target.addClass('cancel_invite');
                target.attr('invite_key', invite.key);
            }
            else if (invite_status == 'invited') {
                target.html('Aceitar');
                target.addClass('accept_invite');
                target.attr('invite_key', invite.key);
            }
            else if( invite_status == 'play') {
                target.html('Jogar');
                target.addClass('play_game');
                target.attr('invite_key', invite.key);
            }
        })
    })*/
    
});

function cleanButtons()
{
    jQuery('.invite_status').each(function () {

        $(this).removeClass('invite_player').removeClass('accept_invite').removeClass('already_invited').removeClass('play_game');
        $(this).html('Convidar');
        $(this).addClass('invite_player');
        $(this).removeAttr('invite_key');

    });
}