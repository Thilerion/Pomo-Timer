var timer = (function() {
  
  var startTime, timeLeft, endTime, interval;  
  var paused = null;
  
  function getMinutesLeft() {
    return Math.floor(Math.round(timeLeft / 1000) / 60 % 60);
  }
  
  function getSecondsLeft() {
    return Math.floor(Math.round(timeLeft / 1000) % 60);
  }
  
  function startTimer() {
    paused = false;
    
    //decrease time left by 1 second to reduce delay after clicking button
    timeLeft -= 1000;
    
    //the end time of the current timer is the amount of time left + the start time
    endTime = Date.now() + timeLeft;
    
    //initialize setInterval on the timer-scoped interval variable
    interval = setInterval(tick, 1000);
  }
  
  function tick() {
    //called by the timer-scoped interval variable every 1000ms
    
    if (timeLeft - 1000 < 50) {
      timeLeft = 0;
      finishedTimer();
    } else {
      timeLeft = endTime - Date.now();
    }
    
    //for debugging
    console.log(timeLeft, getMinutesLeft(), getSecondsLeft());
  }
  
  function resetSession() {
    clearInterval(interval);
    timeLeft = startTime;
    paused = null;
  }
  
  function pauseTimer() {
    clearInterval(interval);
    paused = true;
  }
  
  function finishedTimer() {
    clearTimeout(interval);
  }
  
  function init(minutes) {
    startTime = minutes * 60000;
    paused = null;
    timeLeft = startTime;
    
    //for debugging
    console.log(timeLeft + " milliseconds left, " + startTime + " milliseconds as start time.");
  }
  
  return {
    reset: resetSession,
    pause: pauseTimer,
    start: startTimer,
    init: init,
    getMinutes: getMinutesLeft,
    getSeconds: getSecondsLeft,
    paused: paused
  };
    
})();

/*
initialTimeLeft > startTime
currentTimeLeft > timeLeft
startTimer > initTimer
*/

/*
view is not updated, maybe use observer for that?
maybe convert ms to seconds
*/

/*
missing:
  way to create a new timer
  way to update the view
  interface with pomodoro when timer is finished etc
*/