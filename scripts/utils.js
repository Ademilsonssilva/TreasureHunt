avaliableColors = [
    'red', 'blue', 'lightgreen', 'green', 'orange', 
    'purple', 'brown', 'yellow', 'pink', 'gray',
];

function getColorsSelector (id, defaultColor = null)
{   
    //if(defaultColor == null) {

        selector = $(`<select class="form-control colorSelector" id="${id}"></select>`);

        for(i=0; i < avaliableColors.length; i++) {

            if (defaultColor == avaliableColors[i]) {
                selector.append( `<option value="${avaliableColors[i]}" style="background-color: ${avaliableColors[i]};" selected>`+translateColorName(avaliableColors[i])+`</option>` );
            }
            else {
                selector.append( `<option value="${avaliableColors[i]}" style="background-color: ${avaliableColors[i]};">`+translateColorName(avaliableColors[i])+`</option>` );
            }
            

        }

    //}
    
    return selector;
}

function translateColorName(color)
{
    switch(color) {
        case 'red': return 'Vermelho';
        case 'blue': return 'Azul';
        case 'lightgreen': return 'Verde claro';
        case 'green': return 'Verde';
        case 'orange': return 'Laranja';
        case 'purple': return 'Roxo';
        case 'brown': return 'Marrom';
        case 'yellow': return 'Amarelo';
        case 'pink': return 'Rosa';
        case 'gray': return 'Cinza';
    }
}