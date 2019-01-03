function TreasureHunt(game, player1, player2)
{
    return {
        game: game,
        player1: player1,
        player2: player2,
        table_size: 15,
        treasure_number: 15,
        board_side: 10,
        buildBoard: function () {

            table = $('<table class="game-table"></table>');

			for (var x = 1; x <= this.board_side; x++) {
                
				tr = $('<tr></tr>');

				for (var y = 1; y <= this.board_side; y++) {

					td = $('<td id="' + x + '-' + y + '" class="game-cell">&nbsp;</td>');

					tr.append(td);

				}

				table.append(tr);

            }
            
            return table;

        },
    }
}

function randomizeTreasures(table_size = 100, treasure_number = 15)
{
    treasures = [];

    while(treasure_number > 0) {
        position = Math.floor(Math.random()*table_size);

        if (!treasures.includes(position)) {
            treasures.push(position);
            treasure_number--;
        }
    }

    return treasures;
}