avaliableColors = [
    'red', 'blue', 'lightgreen', 'green', 'orange', 
    'purple', 'brown', 'yellow', 'pink', 'gray',
];

function getColorsSelector (id, defaultColor = null)
{   
    if(defaultColor == null) {

        selector = $(`<select class="form-control colorSelector" id="${id}"></select>`);

        for(i=0; i < avaliableColors.length; i++) {

            selector.append( `<option value="${avaliableColors[i]}" style="background-color: ${avaliableColors[i]};"></option>` );

        }

    }
    
    return selector;
}