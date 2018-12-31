$(document).ready(() => {

    $(document).on('click', '.invite_status', (clicked) => {

        target = $(clicked.currentTarget);

        id = target.prop('id');

        console.log(id);

        if(target.hasClass('invite_player')) {

            fd.ref('invites/').push({
                player: logged_user,
                invited: target.attr('player_key'),
                datetime: firebase.database.ServerValue.TIMESTAMP,
            })
        }
        else if(target.hasClass('cancel_invite')) {
            fd.ref('invites/'+target.attr('invite_key')).set({});

            $('#'+id).addClass('invite_player');
            $('#'+id).html('Convidar');
            $('#'+id).removeAttr('invite_key');
            $('#'+id).removeClass('cancel_invite');
            
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
        
    fd.ref('status/').on('value', (status) => {

        status.forEach((playerState) => {
            spanstate = $(`.status-${playerState.key}`);

            state = playerState.val().state;

            color = state == 'online' ? 'green' : 'red';

            spanstate.html(state).css('color', color);
        });

    })

    fd.ref('invites/').on('value', (response) => {

        $('.invite_status').each(() => {

            $(this).removeClass('invite_player').removeClass('accept_invite').removeClass('cancel_invite');
            $(this).html('Convidar');
            $(this).addClass('invite_player');
            $(this).removeAttr('invite_key');

        });

        console.log(response.val());  

        response.forEach((invite) => {

            if(invite.val().player == logged_user) {
                invite_status = 'inviting';
                target = $(`.btn_player_${invite.val().invited}`);
            }
            else if (invite.val().invited == logged_user) {
                invite_status = 'invited';
                target = $(`.btn_player_${invite.val().player}`);
            }

            target.removeClass('invite_player').removeClass('accept_invite').removeClass('cancel_invite');
            if(invite_status == 'inviting') {
                target.html('Cancelar');
                target.addClass('cancel_invite');
                target.attr('invite_key', invite.key);
            }
            else if (invite_status == 'invited') {
                target.html('Jogar');
                target.addClass('accept_invite');
                target.attr('invite_key', invite.key);
            }
        })
    })

    /*fd.ref('invites/').on('value', (response) => {
        response.forEach((invite) => {
            if(invite.val().player == logged_user) {
                invite_status = 'inviting';
            }
            else if (invite.val().invited == logged_user) {
                invite_status = 'invited';
            }
        })
    })*/

    
    
});
