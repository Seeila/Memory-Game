/******************
*******************
      GLOBAL
*******************
******************/

const cards = ["a", "b", "c", "d", "e", "f", "g", "h"];
const grid = document.getElementById('js-grid');


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


/******************
*******************
MATCHING VERFICATION
*******************
******************/


grid.addEventListener('click', checkCards);


function checkCards(evt) {
   let tempVal, tempCard;
   showCard(evt.target);
   verifyCards(evt.target);
}

//if the card is face down, face up
function showCard( el ) {
   if (!el.classList.contains('show')) {
      el.classList.toggle('show');
   }
}


function verifyCards(el) {
   //list of all the element with a show class
   let returnedCard = document.querySelectorAll('.show');

   //if the list length is an eod number
   if (returnedCard.length % 2 !== 0) {
      //store the card
      tempCard = el;
   } else {
      //if the value of the new clicked card equals the value of the stored card
      if (el.innerText === tempCard.innerText) {
         console.log('yay');
      } else {
         //put the twi cards face down
         el.classList.toggle('show');
         tempCard.classList.toggle('show');
      }

      endingGame(returnedCard);
   }
}


/******************
*******************
   Ending Game
*******************
******************/

//if all the cards have a class show, the game is finished
function endingGame(el){
   if (el.length === 16) {
      console.log('finished');
   }
}
