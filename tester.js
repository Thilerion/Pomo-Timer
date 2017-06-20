/* global timer */

var tester = (function() {
  var speedBtn = document.getElementById("increaseSpeedBtn");
  var skipBtn = document.getElementById("skipSessionBtn");
  
  function skipSession() {
    timer.debugSkip();
  }
  
  function changeSpeed() {
    var speed = 0;
    while (speed < 1 || speed > 50) {
      speed = prompt("Choose the speed at which to run the timer (min 1, max 50 times).", 1);
      console.log("Speed pre-parse: " + speed);
      speed = Number.parseInt(speed);
      console.log("Speed post-parse: " + speed);
      if (Number.isNaN(speed)) {
        speed = 0;
      }
    }
    timer.changeSpeed(speed);
  }
  
  return {
    skip: skipSession,
    changeSpeed: changeSpeed
  };
  //timer.debugSkip()
  //timer._speed
})();