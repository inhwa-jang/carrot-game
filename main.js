'use strict'
const bgSound = new Audio('./sound/bg.mp3');
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const gameWinSound = new Audio('./sound/game_win.mp3');

const field = document.querySelector(".game-field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game_btn");
const gameTimer = document.querySelector(".game_timer");
const gameScore = document.querySelector(".game_score");

const popup = document.querySelector(".pop-up");
const popupMessage = document.querySelector(".pop-up_message");
const popupRefresh = document.querySelector(".pop-up_refresh");

const IMAGE_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick); //event delegation

gameBtn.addEventListener('click', ()=>{
    if(started){
        stopGame();
        console.log(started.toString());//true
    } else {
        startGame();
        console.log(started.toString());//false
    }
});

popupRefresh.addEventListener('click', ()=>{
    startGame();
    hidePopup();
});

function startGame(){
    started = true;
    initGame();
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameBtn();
    showPopUpWithText('Replay❓');
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win){
    started = false;
    hideGameBtn();
    stopGameTimer();
    if(win){
      playSound(gameWinSound);
    }else {
      playSound(bugSound);
    }
    stopSound(bgSound);
    showPopUpWithText(win ? 'You Won🎉' : 'You Lost😭');
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

function showPopUpWithText(text){
    popup.classList.remove("pop-up-hide");
    popupMessage.textContent = text;
}

function hidePopup(){
    popup.classList.add("pop-up-hide");
}

function initGame() {
    score = 0;
    field.innerHTML = '';
    gameScore.innerHTML = CARROT_COUNT;
    addItem("bug", BUG_COUNT ,'img/bug.png');
    addItem("carrot", CARROT_COUNT ,'img/carrot.png');
}

function onFieldClick(event){
    if(!started) {
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);
        }
    } else if(target.matches('.bug')){
        finishGame(false);
    }
}

function playSound(sound){
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound){
  sound.pause();
}

function updateScoreBoard(){
    gameScore.textContent = CARROT_COUNT - score;
}

function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - IMAGE_SIZE;
    const y2 = fieldRect.height - IMAGE_SIZE;
    for (let i = 0; i<count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1,x2);
        const y = randomNumber(y1,y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
   return Math.random() * (max - min) + min;
}




