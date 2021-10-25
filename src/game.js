import Field from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
})

//Build Pattern
export class GameBuilder {
  withGameDuration(duration){
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num){
    this.carrotCount = num;
    return this;
  }

  withBugCount(num){
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount){
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameTimer = document.querySelector(".game_timer");
    this.gameScore = document.querySelector(".game_score");
    this.gameBtn = document.querySelector(".game_btn");

    this.gameBtn.addEventListener('click', ()=>{
      if(this.started){
        this.stop();
        console.log(this.started.toString());//true
      } else {
        this.start();
        console.log(this.started.toString());//false
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start(){
    this.started = true;
    this.initGame();
    this.showStopBtn();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(){
    this.started = false;
    this.stopGameTimer();
    this.hideGameBtn();
    sound.playAlert();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(Reason.cancel);
  }

  finish(win) {
    this.started = false;
    this.hideGameBtn();
    this.stopGameTimer();
    if(win){
      sound.playWin();
    }else {
      sound.playBug();
    }
    sound.stopBackground();
    this.onGameStop && this.onGameStop(win ? Reason.win : Reason.lose);
  }

  onItemClick = item => {
    if (!this.started){
      return;
    }
    if (item === 'carrot') {
      this.score++;
      this.updateScoreBoard(this.score);
      if (this.score === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === 'bug') {
      this.finish(false);
    }
  }

  showStopBtn(){
  	const icon = this.gameBtn.querySelector('.fas');
  	icon.classList.remove("fa-play");
  	icon.classList.add("fa-stop");
  	this.gameBtn.style.visibility = 'visible';
  }

  hideGameBtn(){
    this.gameBtn.style.visibility = 'hidden';
  }

  showTimerAndScore(){
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer(){
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if(remainingTimeSec <= 0) {
        clearInterval(this.timer);
        if(this.started){
          this.finish(this.score === this.carrotCount);
        }
        return; //return하지 않으면 setInterval()가 -1이 되도록 멈추지 않음
      }
      this.updateTimerText(--remainingTimeSec);
    },1000);
  }

  stopGameTimer(){
    clearInterval(this.timer);
  }

  updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.textContent = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerHTML = this.carrotCount;
  	this.gameField.init();
  }

  updateScoreBoard(){
    this.gameScore.textContent = this.carrotCount - this.score;
  }

}