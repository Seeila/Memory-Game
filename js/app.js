/******************
*******************
      GLOBAL
*******************
******************/

const lvlOne = ["a", "b", "c", "d", "e", "f", "g", "h"];
const lvlTwo = ["i", "j", "k", "l"];
const lvlThree = ["m", "n", "o", "p"];
let newLvlOne, newLvlTwo, newLvlThree;
let currentLvl = 16;
const grid = document.getElementById('js-grid');
const restartBtn = document.getElementById('js-restart');
const lvlBtn = document.getElementById('js-lvl');
const movesSection = document.querySelector('#js-moves');


/******************
*******************
      LEVELS
*******************
******************/

function chooseLvl() {
   const newDiv = document.createElement('div');
   newDiv.classList.add('modal-level');

   newDiv.innerHTML = `<h2>Chosse a level</h2>
   <input type="button" value ="Easy"/>
   <input type="button" value ="Normal"/>
   <input type="button" value ="Hard"/>`;

   //creates the modal and the appends it
   document.body.appendChild(newDiv);

   //when modal appended, add click event on both buttons
   const modalButton = document.querySelectorAll('.modal-level');
   modalButton.forEach(function(item) {
      item.addEventListener('click', startLvl);
   })
}

function startLvl(evt) {

   const inputVal = evt.target.value;
   evt.target.parentNode.style.display = 'none';

   if (inputVal === "Easy" || (inputVal === "yes" &&  currentLvl === 16)) {
      newLvlOne = [...lvlOne];
      currentLvl = 16;
      makeGrid(newLvlOne);
   } else if (inputVal === "Normal" || (inputVal === "yes" &&  currentLvl === 24)) {
      currentLvl = 24;
      newLvlTwo = [...lvlOne, ...lvlTwo];
      makeGrid(newLvlTwo);
   } else {
      currentLvl = 32;
      newLvlThree = [...lvlOne, ...lvlTwo, ... lvlThree];
      makeGrid(newLvlThree);
   }

}

chooseLvl();

lvlBtn.addEventListener('click', chooseLvl);
/******************
*******************
   MAKING GRID
*******************
******************/

function makeGrid(el) {
   resetGrid();
   doubleCards(el);
   shuffle(el);
   appendCards(el);
}


//stops the timer and resets all the values of the grid
function resetGrid() {
   min = 0;
   sec = 0;
   timerSection.innerHTML = '00:00';
   moveCount = 0;
   document.getElementById("js-grid").innerHTML = "";
}


function doubleCards(lvl) {
   lvl.forEach(function(card) {
      lvl.push(card);
   });
}
// doubling the cards for the memory game

//shuffles the array -> modern version of the Fisher–Yates shuffle algorithm
function shuffle(el) {
   for (let i = 0; i < el.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [el[i], el[j]] = [el[j], el[i]];
   }
   return el;
}


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
         el.innerHTML = "";
         tempCard.innerHTML = "";
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
   if (el.length === currentLvl) {
      restartModal(el);
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
      //needs to be declared for restartModal to work
      let returnedCard = document.querySelectorAll('.show');
      //opens modal
      restartModal(returnedCard)
   }

}


function restartModal(el) {
      //pauses the timer
      clearInterval(timerID);
      const newDiv = document.createElement('div');
      newDiv.classList.add('modal');

      // if the game is finished
      if (el.length === currentLvl) {
         //duration time
         const durationTime = document.querySelector('.stats-timer');
         const starts = document.querySelector('.stars');
         // content of modal
         newDiv.innerHTML = `<p>${starts.innerHTML}</p>
         <h2>Congratulations ! </h2>
         <p>You just won the game in : </p>
         <p>${durationTime.innerHTML} and ${moveCount} moves </p>
         <p>Are you sure you want to restart the game?</p>
         <input type="button" value ="yes"/>
         <input type="button" value ="Level"/>`;

      } else {
         newDiv.innerHTML = `<p>Are you sure you want to restart the game?</p>
         <input type="button" value ="yes"/>
         <input type="button" value ="no"/>
         <input type="button" value ="Level"/>`;
      }

      //creates the modal and the appends it
      document.body.appendChild(newDiv);

      //when modal appended, add click event on both buttons
      const modalButton = document.querySelectorAll('.modal input');
      modalButton.forEach(function(item) {
         item.addEventListener('click', restartGame);
      })

}

function restartGame(evt) {
   const modal = document.querySelector('.modal');
   //hides the parent of the target
   evt.target.parentNode.style.display = 'none';

   switch (evt.target.value) {
      case "yes":
         //creates a new one
         startLvl(evt);
         //change text of button
         restartBtn.value = "Start Game";
         //adds back the event listener to start the timer on the cards
         grid.addEventListener('click', startGame);
         break;

      case "no":
         launchTimer();
         break;

      case "Level":
         chooseLvl();
         break;
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

   const threeStars = `<span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span> ${moveCount} ${moveCount === 1 ? 'move' : 'moves'}`;

   const twoStars = `<span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span> ${moveCount} moves`;

   const oneStar = `<span class="stars"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i></span> ${moveCount} moves`;

// changin the number stars moves depending the level
   switch(currentLvl) {
      case 16:
         if (moveCount < 20) {
            movesSection.innerHTML = threeStars;
            break;
         } else if (moveCount => 20 && moveCount < 25) {
            movesSection.innerHTML = twoStars;
            break;
         } else {
            movesSection.innerHTML = oneStar;
            break;
         }

      case 24:
         if (moveCount < 30) {
            movesSection.innerHTML = threeStars;
            break;
         } else if (moveCount => 30 && moveCount < 40) {
            movesSection.innerHTML = twoStars;
            break;
         } else {
            movesSection.innerHTML = oneStar;
            break;
         }

      case 32:
         if (moveCount < 40) {
            movesSection.innerHTML = threeStars;
            break;
         } else if (moveCount => 40 && moveCount < 55) {
            movesSection.innerHTML = twoStars;
            break;
         } else {
            movesSection.innerHTML = oneStar;
            break;
         }
   }
   // depending the numbers of moves, the stars will be empty or not and show the number of moves

}
