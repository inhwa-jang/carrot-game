'use strict'

export default class PopUp {
  constructor() {
    this.popup = document.querySelector(".pop-up");
    this.popupMessage = document.querySelector(".pop-up_message");
    this.popupRefresh = document.querySelector(".pop-up_refresh");
    this.popupRefresh.addEventListener('click',() => {
      this.onClick && this.onClick(); 
      hide();
    })
  }

  setClickListener(onClick) {
    this.onClick = onClick;  
  };

  showWithText(text){
    this.popup.classList.remove("pop-up-hide");
    this.popupMessage.textContent = text;
}

  hide() {
    this.popup.classList.add("pop-up-hide");
  }
}