/******************
*******************
      GLOBAL
*******************
******************/

const cards = ["a", "b", "c", "d", "e", "f", "g", "h"];
const grid = document.getElementById('js-grid');
const restartBtn = document.getElementById('js-restart');
const movesSection = document.querySelector('#js-moves');


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

// doubling the cards for the memory game
cards.forEach(function(card) {
   cards.push(card);
});


//insert the cards in the grid section
function appendCards(el) {

   const fragment = document.createDocumentFragment();

   for (let i = 0; i < el.length; i++) {
      const newDiv = document.createElement('div');
      // add the content of the array's element in the div
      let divContent = el[i];
      newDiv.innerText = divContent;
      fragment.appendChild(newDiv);
   }

   grid.appendChild(fragment);
}


function makeGrid(el) {

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
function showCard(el) {
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

      moves();
      endingGame(returnedCard);
   }
}


/******************
*******************
   Ending Game
*******************
******************/

//if all the cards have a class show, the game is finished
function endingGame(el) {
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
let timerID;
let min = 0;
let sec = 0;
const timerSection = document.querySelector('#js-timer');

function launchTimer() {
   grid.removeEventListener('click', startGame);
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

grid.addEventListener('click', startGame);


/******************
*******************
   STARS RATING
*******************
******************/

let moveCount = 0;

function moves() {
   // adds 1 to the counter
   moveCount++;

   // depending the numbers of moves, the stars will be empty or not and show the number of moves
   if (moveCount < 20) {
      movesSection.innerHTML = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> ${moveCount} ${moveCount === 1 ? 'move' : 'moves'}`;
   } else if (moveCount => 20 && moveCount < 25) {
      movesSection.innerHTML = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> ${moveCount} moves`;
   } else {
      movesSection.innerHTML = `<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ${moveCount} moves`;
   }
}


/******************
*******************
   RESET BUTTON
*******************
******************/

restartBtn.addEventListener('click', startGame);

function startGame(evt) {
   if (restartBtn.value === "Start Game") {
      launchTimer();
      //change text of button
      restartBtn.value = "Restart Game";
   } else {
      //opens modal
      restartModal()
   }

}

//stops the timer and resets all the values of the grid
function resetGrid() {
   min = 0;
   sec = 0;
   timerSection.innerHTML = '00:00';
   moveCount = 0;
   document.getElementById("js-grid").innerHTML = "";
}

function restartModal() {
      //pauses the timer
      clearInterval(timerID);

      //creates the modal and the appends it
      const newDiv = document.createElement('div');
      newDiv.classList.add('modal');
      newDiv.innerHTML = `<p>Are you sure you want to restart the game?</p>
      <input type="button" value ="yes"/>
      <input type="button" value ="no"/>`;
      document.body.appendChild(newDiv);

      //when modal appended, add click event on both buttons
      const modalButton = document.querySelectorAll('.modal input');
      modalButton.forEach(function(item) {
         item.addEventListener('click', restartGame);
      })

}

function restartGame(evt) {
   const inputVal = evt.target.value;
   const modal = document.querySelector('.modal');

   if (inputVal === "yes") {
      //closes the modal
      modal.style.display = 'none';
      //erases the game
      resetGrid();
      //creates a new one
      makeGrid(cards);
      //change text of button
      restartBtn.value = "Start Game";
      //adds back the event listener to start the timer on the cards
      grid.addEventListener('click', restartGame);
   } else {
      //closes the modal
      modal.style.display = 'none';
      //launches back the timer
      launchTimer();
   }

}
