/******************
*******************
      GLOBAL
*******************
******************/

const cards = ["a", "b", "c", "d", "e", "f", "g", "h"];
const grid = document.getElementById('js-grid');
const restartBtn = document.getElementById('js-restart');


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
      //ends the timer
      clearInterval(timerID);
   }
}



/******************
*******************
      TIMER
*******************
******************/
let timerID ;
let min = 0;
let sec = 0;
const timerSection = document.querySelector('#js-timer');

function launchTimer() {
   grid.removeEventListener('click', launchTimer);
   //each seconds the function timer is called
   timerID = setInterval(timer, 1000);
}

function timer() {

   if (sec == 60) {
      min++;
      sec = 0;
   } else {
      sec++;
   }

   if (sec > 60) {
      return false;
   }
   // return the minutes and seconds + 0 in front of them if under 10
   timerSection.innerHTML = `${min > 9 ? min: "0" + min}:${sec > 9 ? sec: "0" + sec}`;
}

grid.addEventListener('click', launchTimer);
restartBtn.addEventListener('click', launchTimer);
