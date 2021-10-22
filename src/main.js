'use strict'
import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const bgSound = new Audio('./sound/bg.mp3');
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const gameWinSound = new Audio('./sound/game_win.mp3');

const gameBtn = document.querySelector(".game_btn");
const gameTimer = document.querySelector(".game_timer");
const gameScore = document.querySelector(".game_score");

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(()=>{
  startGame();
});

const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started){
    return;
  }
  if (item === 'carrot') {
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
			finishGame(true);
    }
	} else if (item === 'bug') {
		finishGame(false);
	}
}

gameBtn.addEventListener('click', ()=>{
  if(started){
    stopGame();
    console.log(started.toString());//true
  } else {
    startGame();
    console.log(started.toString());//false
  }
});

function startGame(){
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function stopGame(){
  started = false;
  stopGameTimer();
  hideGameBtn();
  gameFinishBanner.showWithText('Replay❓');
  sound.playAlert();
  sound.stopBackground();
}

function finishGame(win){
  started = false;
  hideGameBtn();
  stopGameTimer();
  if(win){
    sound.playWin();
  }else {
    sound.playBug();
  }
  sound.stopBackground();
  gameFinishBanner.showWithText(win ? 'You Won🎉' : 'You Lost😭');
}

function showStopBtn(){
	const icon = gameBtn.querySelector('.fas');
	icon.classList.remove("fa-play");
	icon.classList.add("fa-stop");
	gameBtn.style.visibility = 'visible';
}

function hideGameBtn(){
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore(){
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer(){
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if(remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return; //return하지 않으면 setInterval()가 -1이 되도록 멈추지 않음
    }
    updateTimerText(--remainingTimeSec);
  },1000);
}

function stopGameTimer(){
  clearInterval(timer);
}

function updateTimerText(time){
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.textContent = `${minutes}:${seconds}`;
}

function initGame() {
  score = 0;
  gameScore.innerHTML = CARROT_COUNT;
	gameField.init();
}

function updateScoreBoard(){
  gameScore.textContent = CARROT_COUNT - score;
}





