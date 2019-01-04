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
        configureGame: function () 
        {
            this.player1Color = player1.primary_color;
            this.player2Color = player2.primary_color == player1.primary_color ? player2.secondary_color : player2.primary_color;
        },
        playerColor: function (playerKey) 
        {
            return (playerKey == this.player1Key ? this.player1Color : this.player2Color);
        },
        buildBoard: function () {

            table = $('<table class="game-table"></table>');

			for (var x = 1; x <= this.board_side; x++) {
                
				tr = $('<tr></tr>');

				for (var y = 1; y <= this.board_side; y++) {

					td = $(`<td id="${x}-${y}" class="game-cell" x="${x}" y="${y}">&nbsp;</td>`);

					tr.append(td);

				}

				table.append(tr);

            }
            
            $('#game_div').append(table);

            width = $('.game-table').width();

            height = $('.game-table').height();

            $('.game-table').height(width);

            td_width = $('.game-cell').width();

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
            if(this.game.treasures.includes(position)) {
                return 'hit';
            }
            else {
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

                near_treasures = 0;

                for(j = min_x; j <= max_x; j++) {

                    for(k = min_y; k <= max_y; k++) {

                        verified_position = this.jqToDbPosition(j, k);

                        if(this.game.treasures.includes(verified_position)) {
                            near_treasures++;
                        }
                    }

                }

                //console.log(`${min_x} - ${max_x} - ${min_y} - ${max_y}`);

                return near_treasures;
            }
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