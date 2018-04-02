/******************
*******************
      GLOBAL
*******************
******************/


const lvlOne = ["<img src='img/cards_01.png' alt='hiragana a'>", '<img src="img/cards_02.png" alt="hiragana i">', '<img src="img/cards_03.png" alt="hiragana u">', '<img src="img/cards_04.png" alt="hiragana e">', '<img src="img/cards_05.png" alt="hiragana o">', '<img src="img/cards_06.png" alt="hiragana ka">', '<img src="img/cards_07.png" alt="hiragana ki">', '<img src="img/cards_08.png" alt="hiragana ku">'];

const lvlTwo = ['<img src="img/cards_09.png" alt="hiragana ke">', '<img src="img/cards_10.png" alt="hiragana ko">', '<img src="img/cards_11.png" alt="hiragana sa">', '<img src="img/cards_12.png" alt="hiragana shi">'];

const lvlThree = ['<img src="img/cards_13.png" alt="hiragana su">', '<img src="img/cards_14.png" alt="hiragana se">', '<img src="img/cards_15.png" alt="hiragana so">', '<img src="img/cards_16.png" alt="hiragana n">'];

let newLvlOne, newLvlTwo, newLvlThree;
let currentLvl = 16;
const grid = document.getElementById('js-grid');
const restartBtn = document.getElementById('js-restart');
const lvlBtn = document.getElementById('js-lvl');
const movesSection = document.querySelector('#js-moves');
const mainContainer = document.querySelector('.main-container');


/******************
*******************
      LEVELS
*******************
******************/
function chooseLvlModal() {
   mainContainer.style.maxHeight = '100vh';

   const newDiv = document.createElement('div');
   newDiv.classList.add('modal-level');

   newDiv.innerHTML = `<div class="modal-inner">
      <h2>Choose a level</h2>
      <section class="modal-inputs">
         <button type="button" value ="Easy" class="btn"><img src="img/panda_easy.png" alt="laughing panda by Freepik"><span>Easy</span></button>
         <button type="button" value ="Normal" class="btn"><img src="img/panda_medium.png" alt="Straight face panda by Freepik"><span>Normal</span></button>
         <button type="button" value ="Hard" class="btn"/><img src="img/panda_hard.png" alt="Crying panda by Freepik"><span>Hard</span></button>
      </section>
   </div>`;
   // span around text inside btn to make text same lvl as image when onclick

   //creates the modal and the appends it
   document.body.appendChild(newDiv);

   //when modal appended, add click event on both buttons
   const modalButton = document.querySelectorAll('.modal-level');
   modalButton.forEach(function(item) {
      item.addEventListener('click', startLvl);
   });
}

function startLvl(evt) {
   const inputVal = evt.target.parentNode.value;

   const modalWindow = evt.target.parentNode.parentNode.parentNode.parentNode;
   modalWindow.style.display = 'none';
   mainContainer.style.maxHeight = '100%';

   if (inputVal === "Easy" || (inputVal === "yes" &&  currentLvl === 16)) {
      newLvlOne = [...lvlOne];
      currentLvl = 16;
      grid.style.gridTemplateRows = 'repeat(4, 1fr)';
      makeGrid(newLvlOne);

   } else if (inputVal === "Normal" || (inputVal === "yes" &&  currentLvl === 24)) {
      currentLvl = 24;
      newLvlTwo = [...lvlOne, ...lvlTwo];
      grid.style.gridTemplateRows = 'repeat(6, 1fr)';
      makeGrid(newLvlTwo);
   } else {
      currentLvl = 32;
      newLvlThree = [...lvlOne, ...lvlTwo, ... lvlThree];
      grid.style.gridTemplateRows = 'repeat(8, 1fr)';
      makeGrid(newLvlThree);
   }
}

chooseLvlModal();

lvlBtn.addEventListener('click', chooseLvlModal);



/******************
*******************
   MAKING GRID
*******************
******************/

function makeGrid(el){
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
   restartBtn.innerText = "START GAME";
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
      const card = `<div class="card">
            <div class="front"><img src="img/empty.png" alt="faced down card"/><div class="shadow"></div></div>
            <div class="back">${el[i]}<div class="shadow"></div></div>
         </div>`;
      newDiv.innerHTML = card;
      newDiv.className = "card-container";
      fragment.appendChild(newDiv);
   }
   grid.appendChild(fragment);

   const numberCards = document.querySelectorAll('.card');
   numberCards.forEach(function(card) {
      card.addEventListener('click', flippCards);
   });

   grid.addEventListener('click', startGame);
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




/******************
*******************
MATCHING VERFICATION
*******************
******************/

function flippCards(evt) {
   let tempVal, tempCard;
   const grandParent = evt.target.parentNode.parentNode;
   //grand parent to aim the div card
   showCard(grandParent);
   verifyCards(grandParent);
}

//if the card is face down, face up
function showCard(el) {
   if (!el.classList.contains('show')) {
      el.classList.toggle('show');
   }
}


function verifyCards(el) {
   //list of all the element with a show class
   const returnedCard = document.querySelectorAll('.show');
   const cardImage = el.querySelector('.back img');
   const numberCards = document.querySelectorAll('.card');

   //if the list length is an eod number
   if (returnedCard.length % 2 !== 0) {
      //store the card
      tempCard = cardImage;
   } else {
      //doesn't allow more than two cards to be returned at a time
      numberCards.forEach(function(card) {
         card.removeEventListener('click', flippCards);
      });
      //if the value of the new clicked card equals the value of the stored card
      if (cardImage.src === tempCard.src) {
         cardImage.display = "none";
         tempCard.display = "none";
         // allows back to flipp cards
         numberCards.forEach(function(card) {
            card.addEventListener('click', flippCards);
         });
         //doesn't allow the cards shown to be clicked
         returnedCard.forEach(function(card) {
            card.removeEventListener('click', flippCards);
         });
      } else if (cardImage.src !== tempCard.src) {
         //put the two cards face down
         window.setTimeout(function() {
            el.classList.toggle('show');
            tempCard.parentNode.parentNode.classList.toggle('show');
            // allows back to flipp cards
            numberCards.forEach(function(card) {
               card.addEventListener('click', flippCards);
            });
         }, 1000);
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
   STARS RATING
*******************
******************/

let moveCount = 0;

function moves() {
   // adds 1 to the counter
   moveCount++;

   const threeStars = `<span class="stars"><img src="img/nigiri.png"></span> ${moveCount} ${moveCount === 1 ? 'move' : 'moves'}`;

   const twoStars = `<span class="stars"><img src="img/maki.png"></span> ${moveCount} moves`;

   const oneStar = `<span class="stars"><img src="img/onigiri.png"></span> ${moveCount} moves`;

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


/******************
*******************
   RESET BUTTON
*******************
******************/

restartBtn.addEventListener('click', startGame);

function startGame(evt) {
   if (restartBtn.innerText === "START GAME") {
      launchTimer();
      //change text of button
      restartBtn.innerText = "RESTART GAME";
   } else {
      //needs to be declared for restartModal to work
      let returnedCard = document.querySelectorAll('.show');
      //opens modal
      restartModal(returnedCard)
   }

}


function restartModal(el) {
      mainContainer.style.maxHeight = '100vh';
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
         newDiv.innerHTML = `<div class="modal-inner winner">
         <p class="move-results">${starts.innerHTML}</p>
         <h2>Congratulations ! </h2>
         <p>You just won the game in : </p>
         <p class="results">${durationTime.innerHTML} <span class="red">|</span> ${moveCount} moves </p>
         <p>Are you sure you want to restart the game?</p>
         <section class="modal-inputs">
            <button type="button" value ="yes" class="btn"><img src="img/panda_easy.png" alt="laughing panda by Freepik"><span>Yes</span></button>
            <button type="button" value ="Level" class="btn"><img src="img/levels.png" alt="Sushis by Freepik"><span>Level</span></button>
         </section>
         <div/>`;

      } else {
         newDiv.innerHTML = `<div class="modal-inner">
            <h2>Are you sure you want to restart the game?</h2>
            <section class="modal-inputs">
               <button type="button" value ="yes" class="btn"><img src="img/panda_easy.png" alt="laughing panda by Freepik"><span>Yes</span></button>
               <button type="button" value ="no" class="btn"><img src="img/panda_nope.png" alt="Sad panda by Freepik"><span>No</span></button>
               <button type="button" value ="Level" class="btn"><img src="img/levels.png" alt="Sushis by Freepik"><span>Level</span></button>
            </section>
         </div>`;
      }

      //creates the modal and the appends it
      document.body.appendChild(newDiv);

      //when modal appended, add click event on both buttons
      const modalButton = document.querySelectorAll('.modal button');
      modalButton.forEach(function(item) {
         item.addEventListener('click', restartGame);
      })

}

function restartGame(evt) {
   const modal = document.querySelector('.modal');
   //hides the parent of the target
   const modalWindow = evt.target.parentNode.parentNode.parentNode.parentNode;
   modalWindow.style.display = 'none';
      mainContainer.style.maxHeight = '100%';

   switch (evt.target.parentNode.value) {
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
         chooseLvlModal();
         break;
   }

}
