$(document).ready(() => {

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

                invite_button = $(`<btn class="invite_button btn btn-sm btn-success btn-style-1"> Convidar </button>`);

                accept_invite_button = $(`<btn class="accept_invite_button btn btn-sm btn-success btn-style-1"> Aceitar </button>`);
                
                col1.append(span);
                col2.append(invite_button).append(accept_invite_button);

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

    
    
});
