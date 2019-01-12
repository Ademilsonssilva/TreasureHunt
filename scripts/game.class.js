function TreasureHunt(game, player1, player2, playerKey)
{
    return {
        game: game,
        player1: player1,
        player1Key: game.player1,
        player2Key: game.player2,
        player2: player2,
        myKey: playerKey,
        table_size: 15,
        treasure_number: 15,
        board_side: 10,
        moves: null,
        moves_array: null,
        configureGame: function () 
        {
            this.player1Color = player1.primary_color;
            this.player2Color = player2.primary_color == player1.primary_color ? player2.secondary_color : player2.primary_color;
        },
        playerColor: function (playerKey) 
        {
            return (playerKey == this.player1Key ? this.player1Color : this.player2Color);
        },
        playerScore: function (playerKey)
        {
            return (playerKey == this.player1Key ? this.player1Score : this.player2Score);
        },
        getPlayer: function (playerKey) 
        {
            return (playerKey == this.player1Key ? this.player1 : this.player2);
        },
        buildBoard: function () {

            table = $('<table class="game-table"></table>');

			for (var x = 1; x <= this.board_side; x++) {
                
				tr = $('<tr></tr>');

				for (var y = 1; y <= this.board_side; y++) {

					td = $(`<td id="${x}-${y}" class="game-cell center noselect" x="${x}" y="${y}">&nbsp;</td>`);

					tr.append(td);

				}

				table.append(tr);

            }
            
            $('#game_div').append($('<center ></center>').append(table));

            this.adjustScreenSize();

            td_width = $('.game-cell').width();

        },

        adjustScreenSize: function () 
        {

            window_width = $(window).width();
            window_height = $(window).height();

            if(window_width > window_height) {
                table_size = window_height * 0.75;
            }
            else {
                table_size = window_width * 0.9;
            }

            $('.game-table').height(table_size);
            $('.game-table').width(table_size);

            cell_size = $('.game-cell').first().width();
            $('.game-table').css('font-size', cell_size* 0.5);
            

        },
        populateBoard: function () 
        {

            for(i=0; i < this.moves.length; i++) {

                move = this.moves[i].position;

                move_result = this.verifyMoveResult(move);

                table_position = this.translateDBPosition(move);

                if(move_result == 'hit') {
                    if (this.moves[i].hit) {
                        move_result = 'X';
                    }
                    else {
                        move_result = '0';
                    }
                }

                if(i == this.moves.length-1) {
                    $('.last_move').removeClass('last_move');
                    $('#'+table_position).addClass('last_move');
                }

                $('#'+table_position).html(move_result);
                $('#'+table_position).css('color', this.playerColor(this.moves[i].player));                

            }
        },
        getNextPlayer: function () 
        {
            return this.game.nextPlayer;
        },
        setNextPlayer: function (next) 
        {
            this.game.nextPlayer = next;
            if(this.game.winner != null) {
                $('#move_details').html('O jogo terminou! O vencedor é '+ this.getPlayer(this.game.winner).name);
                $('#move_details').css('color', this.playerColor(this.game.winner));
                $('#move_details').append(`<br><a class="btn btn-sm btn-primary" href="home.html">Voltar</a>`);
            }
            if(next != null) {
                $('#move_details').html('Vez de '+ this.getPlayer(next).name);
                $('#move_details').css('color', this.playerColor(next));
            }
        },
        translatePosition: function (pos) 
        {
            x = pos.attr('x');
            y = pos.attr('y');

            //db_position = (parseInt(x-1)*10) + parseInt(y);
            db_position = this.jqToDbPosition(x, y);

            return db_position;
        },
        jqToDbPosition: function (x, y) 
        {
            return (parseInt(x-1)*10) + parseInt(y);
        },
        updateScores: function () 
        {
            $('#player_1_status').html(th.player1Score + ' acertos');
            $('#player_2_status').html(th.player2Score + ' acertos');
        },
        translateDBPosition: function (pos)
        {
            if(pos % 10 != 0){
                first = parseInt(Math.trunc(pos / 10))+1;
                second = pos % 10;
            }
            else {
                first = parseInt(Math.trunc(pos / 10));
                second = 10;
            }

            return `${first}-${second}`;
        },
        verifyMoveResult: function (position) 
        {
            
            neighbors = this.getPositionNeighborhood(position);

            if(this.game.treasures.includes(position)) {
                $('.last_move_neighborhood').removeClass('last_move_neighborhood');

                for(ne = 0; ne < neighbors.length; ne++) {
                    $('#'+this.translateDBPosition(neighbors[ne])).addClass('last_move_neighborhood');
                }

                return 'hit';

            }

            near_treasures = 0;

            $('.last_move_neighborhood').removeClass('last_move_neighborhood');

            for(ne = 0; ne < neighbors.length; ne++) {

                verified_position = neighbors[ne];

                $('#'+this.translateDBPosition(verified_position)).addClass('last_move_neighborhood');

                if(this.game.treasures.includes(verified_position)) {
                    near_treasures++;
                }

            }    

            return near_treasures;
        
        },
        getPositionNeighborhood: function (position) 
        {
            if(position % 10 != 0){
                x = parseInt(Math.trunc(position / 10))+1;
                y = position % 10;
            }
            else {
                x = parseInt(Math.trunc(position / 10));
                y = 10;
            }

            min_x = x > 2 ? x-2 : 1;
            max_x = x < 9 ? x+2 : 10;

            min_y = y > 2 ? y-2 : 1;
            max_y = y < 9 ? y+2 : 10;

            neighbors = [];

            for(j = min_x; j <= max_x; j++) {

                for(k = min_y; k <= max_y; k++) {

                    neighbors.push(this.jqToDbPosition(j, k));

                }

            }

            return neighbors;
        },
        getOpponentKey: function () 
        {
            return (this.player1Key == this.myKey ? this.player2Key : this.player1Key);
        }
    }
}

function randomizeTreasures(table_size = 100, treasure_number = 15)
{
    treasures = [];

    while(treasure_number > 0) {
        position = Math.floor(Math.random()*(+table_size - +1) + +1);

        if (!treasures.includes(position)) {
            treasures.push(position);
            treasure_number--;
        }
    }

    return treasures;
}