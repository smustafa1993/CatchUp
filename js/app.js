//elemnts initializing

const gridButtons = document.querySelectorAll('.grid-btn');
const startButton = document.getElementById('start-btn');
const easyButton = document.getElementById('easy-btn');
const hardButton = document.getElementById('hard-btn');
const gridContainer = document.querySelector('.grid-container');//panel
const timerElement = document.getElementById('timer');
const instructions = document.getElementById('instructions');


//constants
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let correctNumbers = [];
let expectedValue = 1;
let timer;
let timeLeft = 60;
let gridMoveInterval;
let movementTimer=2000;
let hardButtonEnabled =false;
let easyButtonEnabled =false;

//onload



//functions
function shuffleArray(array) {//randomize numbers function (to be called later)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));//j
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomizeGrid() {//function is called after every click of any button in the grid
  shuffleArray(numbers);
  gridButtons.forEach((button, index) => {
    const value = numbers[index];
    button.textContent = value;
    button.setAttribute('data-value', value);//assigning new ramdomized set
    if (!hardButtonEnabled){
    button.style.backgroundColor = correctNumbers.includes(value) ? 'green' : '#fff';}
    //above line is the logic for moving green color w the correct value... took a while to figure out tbh
  });
}

function resetButtons() {
  gridButtons.forEach(button => {
    const val = parseInt(button.getAttribute('data-value'));
    //if (correctNumber)
    if (!correctNumbers.includes(val)) {
      button.style.backgroundColor = '#fff';
    }
  });
}

function moveGrid() {// Moving the grid around without messing up the buttons
  const marginTop = 80; // Even with the 0.7*inner height being reduced to 0.7 the grid kept covering the timer so this had to be added
  const maxX = window.innerWidth * 0.85 - gridContainer.offsetWidth; // the grid kept stretching the window and going out of bounds so had to limit it
  const maxY = window.innerHeight * 0.7 - gridContainer.offsetHeight;

  const offsetX = window.innerWidth * 0.15;//stretching issue solver
  const offsetY = window.innerHeight * 0.15 + marginTop;//timer issue

  const randomX = offsetX + Math.random() * maxX;//assigning the random values
  const randomY = offsetY + Math.random() * (maxY - marginTop);

  gridContainer.style.left = `${randomX}px`;
  //gridContainer1.style.left = `${randomX}px`;
  gridContainer.style.top = `${randomY}px`;//dont forget "px" again... trust me...
}

//Following code isnt all by me. I took too long to get the timer to get the display of time reducing to work

function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  if(hardButtonEnabled){
    reduceTime(30);}

    if(easyButtonEnabled){
      reduceTime(-30);}

  updateTimerDisplay();

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      //alert("HAH get good");
      resetPage();
      timerElement.textContent="HAH get good";
      timerElement.style.color="red";
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function reduceTime(seconds) {
  timeLeft -= seconds;
  if (timeLeft < 0) timeLeft = 0;
  updateTimerDisplay();
}

function centerGrid(){
  const viewportHeight = window.innerHeight;
const viewportWidth = window.innerWidth;

const containerHeight = gridContainer.offsetHeight;
const containerWidth = gridContainer.offsetWidth;

gridContainer.style.position = 'absolute';
gridContainer.style.top = `${(viewportHeight - containerHeight) / 1.75}px`;
gridContainer.style.left = `${(viewportWidth - containerWidth) / 1.75}px`;

}

function resetPage() {
  clearInterval(timer);
  stopGridMovement();
  enableStartButton();
  enableEasyButton();
  enableHardButton();
 // randomizeGrid();
  resetButtons();
  timeLeft = 60;
  timerElement.textContent = "01:00";
  expectedValue = 1;
  correctNumbers = [];
  disableButtons();
  enableInstructions();
  centerGrid();
  
}

function stopGridMovement() {
  clearInterval(gridMoveInterval);
}

function enableButtons() {
  gridButtons.forEach(button => button.disabled = false);
}

function disableButtons() {
  gridButtons.forEach(button => button.disabled = true);
}

function enableStartButton() {
  startButton.style.display = 'block';
  startButton.disabled = false;
}
function enableEasyButton() {
  easyButton.style.display = 'block';
  easyButton.disabled = false;
}
function enableHardButton() {
  hardButton.style.display = 'block';
  hardButton.disabled = false;
}

function enableInstructions(){
  instructions.disabled = false;
  instructions.style.display = 'block';
}

function disableInstructions(){
  instructions.disabled = true;
  instructions.style.display='none';  
}

function disableStartButton() {
  startButton.style.display = 'none';
  startButton.disabled = true;
}

function disableHardButton() {
  hardButton.style.display = 'none';
  hardButton.disabled = true;
}

function disableEasyButton() {
  easyButton.style.display = 'none';
  easyButton.disabled = true;
}

//onload
disableButtons();

//logic for button clicks

gridButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.disabled) return;

    const clickedValue = parseInt(button.getAttribute('data-value'));
    
    if (clickedValue === expectedValue) {
      correctNumbers.push(clickedValue);
      expectedValue++;

      if (expectedValue > 9) {
        setTimeout(() => {// so shuffling isnt instant
          //alert("Ayyyy you won lets gooo!");
          resetPage();
          timerElement.textContent="Ayyyy you won lets gooo!";
          timerElement.style.color="green";
          expectedValue = 1;
          correctNumbers = [];
          resetButtons();
          //expectedValue=0;
          stopGridMovement();
          clearInterval(timer);
          enableStartButton();
          enableEasyButton();
          enableHardButton();
        }, 500);
      }
    } else {
      //Wrong buttonselection consequence. Shows red, reduces time by 5 seconds, resets selection
      button.style.backgroundColor = 'red';
      if (hardButtonEnabled){reduceTime(10)}
      else (reduceTime(5));


      disableButtons();//DO NOT REMOVE. prevents wrong click bug

      setTimeout(() => {// so shuffling isnt instant
        expectedValue = 1;
        correctNumbers = []; 
        resetButtons();
        //expectedValue=0;
        randomizeGrid();
        enableButtons();
      }, 500);

      return; 
      //randomizeGrid();
    }

    randomizeGrid();
  });
});

startButton.addEventListener('click', () => {
  disableStartButton();
  disableEasyButton();
  disableHardButton();
  disableInstructions();
  randomizeGrid();
  expectedValue = 1;
  correctNumbers = [];
  resetButtons();
  enableButtons();
  timerElement.style.color="black";
  if(hardButtonEnabled){
    reduceTime(30);
    movementTimer=800;}
   else if(easyButtonEnabled){
      reduceTime(-30);
      movementTimer=2500;}


  startTimer();
  gridMoveInterval = setInterval(moveGrid, movementTimer);
});

hardButton.addEventListener('click', () => {
  
  if(hardButtonEnabled){
    hardButton.style.backgroundColor="white";
    hardButtonEnabled=false;
    return;
  }
  hardButtonEnabled=true;
  hardButton.style.backgroundColor="green";

});

easyButton.addEventListener('click', () => {
  
  if(easyButtonEnabled){
    easyButton.style.backgroundColor="white";
    easyButtonEnabled=false;
    return;
  }
  easyButtonEnabled=true;
  easyButton.style.backgroundColor="green";
});