/******************
*******************
      GLOBAL
*******************
******************/

const cards = ["a", "b", "c", "d", "e", "f", "g", "h"];


/******************
*******************
   SHUFFLE
*******************
******************/

//shuffles the array -> modern version of the Fisher–Yates shuffle algorithm
function shuffle(el) {
    for (let i = 0; i < el.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [el[i], el[j]] = [el[j], el[i]];
    }
    return el;
}



/******************
*******************
   MAKING GRID
*******************
******************/

//insert the cards in the grid section
function appendCards(el) {

   const grid = document.getElementById('js-grid');
   const fragment = document.createDocumentFragment();

   for (let i = 0; i < el.length; i++) {
      const newDiv = document.createElement('div');
      // add the content of the array's element in the div
      let divContent = el[i];
      newDiv.innerText = divContent ;
      fragment.appendChild(newDiv);
   }

   grid.appendChild(fragment);
}


function makeGrid(el) {

   // doubling the cards for the memory game
   cards.forEach(function(card) {
      cards.push(card);
   });

   shuffle(el);
   appendCards(el);
}

makeGrid(cards);
