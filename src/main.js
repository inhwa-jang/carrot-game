'use strict'
import PopUp from './popup.js';
import Game from './game.js'

const gameFinishBanner = new PopUp();
const game = new Game(5, 5, 5);

game.setGameStopListener(reason => {
  console.log(reason);
  let message;
  switch (reason) {
    case 'cancle':
      message = 'Replay❓';
      break;
    case 'win':
      message = 'You Won🎉';
      break;
    case 'lose':
      message = 'You Lost😭';
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(()=>{
  game.start();
});







