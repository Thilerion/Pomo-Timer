/*jshint devel: true, esversion: 6, browser: true*/
// changes the display whenever the controller sends a command

/*
things to change in display:
    *timer
    *resumePauseButton icon
    disable resetsession button
    *currentSession
    *sessionDurations
    *disable duration change buttons when limit is reached
*/

var view = (function () {
    //module whose only function is to change the view
    //first declares variables for each element in the document that can be changed
    let documentElements = {};
    //time element for the timer (time remaining)
    documentElements.time = document.getElementById("time");
    //span between session duration change buttons, showing the current duration
    documentElements.workDurationTime = document.getElementById("workDuration");
    documentElements.sBreakDurationTime = document.getElementById("sBreakDuration");
    documentElements.lBreakDurationTime = document.getElementById("lBreakDuration");
    //list of every (6) duration change buttons
    documentElements.durationChangeButtonList = document.querySelectorAll(".durBtn");
    //span after h2 current session heading showing the current session
    documentElements.currentSession = document.getElementById("currentSession");
    //start/resume/pause button
    documentElements.resumePauseButton = document.getElementById("resumePauseTimer");
    //reset session button: disabling
    documentElements.resetSessionButton = document.getElementById("resetSession");

    console.log(documentElements);

    return {

    };

})();



/* OLD CODE

var view = (function () {
  var timeP = document.getElementById("time");
  
  var sbDur = document.getElementById("sBreakDuration");
  var lbDur = document.getElementById("lBreakDuration");
  var wDur = document.getElementById("workDuration");

  var resumePauseBtnIcon = document.getElementById("resumePauseTimerIcon");
  var resumePauseBtnBg = document.querySelector(".playButton-play");
  
  let resetBtn = document.getElementById("resetSession");
  
  var timeSectionDiv = document.querySelector(".timeSection");
  
  function displayTime() {
    var time = timer.getTime();
    timeP.innerHTML = ("0" + time[0]).slice(-2) + ":" + ("0" + time[1]).slice(-2);
    updateProgressBar();
  }
  
  function updateProgressBar() {
    var max = pomodoro.getCurrent().length * 60;
    var timeLeft = timer.getTime();
    var secondsLeft = timeLeft[0] * 60 + timeLeft[1];
    var current = max - secondsLeft;
    
    progress.updateBar(current, max);
  }

  function displaySession() {
    var session = pomodoro.getCurrent().name;
    if (session === "work") {
      session = 0;
    } else if (session === "sBreak") {
      session = 1;
    } else if (session === "lBreak") {
      session = 2;
    }
    
    var cardHeaders = document.querySelectorAll(".sessionCards-card > h2");
    console.log(cardHeaders);
    
    for (var i = 0; i < cardHeaders.length; i++) {
      if (session === i) {
        cardHeaders[i].style.background = "#1976d2";
      } else {
        //cardHeaders[i].style.background = "#1976d2";
        cardHeaders[i].style.background = "#455a64";
      }
    }
  }

  function displaySessionLengths() {
    var lengths = pomodoro.getSessionLengths();
    
    var oldWDur = wDur.innerHTML;
    var oldSbDur = sbDur.innerHTML;
    var oldLbDur = lbDur.innerHTML;
    
    var newWDur = lengths[0][1];
    var newSbDur = lengths[1][1];
    var newLbDur = lengths[2][1];
    
    wDur.innerHTML = newWDur;
    sbDur.innerHTML = newSbDur;
    lbDur.innerHTML = newLbDur;
  }

  function pauseResumeButton(started, running) {
    if (started === false) {
      //text = Start Session
      changePauseResumeButton(false);
    } else if (started === true && running === false) {
      //text = Resume Session
      changePauseResumeButton(false);
    } else if (started === true && running === true) {
      //text = Pause Session
      changePauseResumeButton(true);
    }
  }
  
  function changePauseResumeButton(showPause) {
    if (showPause) {
      resumePauseBtnIcon.classList.remove("fa-play");
      resumePauseBtnIcon.classList.add("fa-pause");
      resumePauseBtnBg.classList.remove("playButton-play");
      resumePauseBtnBg.classList.add("playButton-pause");
    } else {
      resumePauseBtnIcon.classList.remove("fa-pause");
      resumePauseBtnIcon.classList.add("fa-play");
      resumePauseBtnBg.classList.remove("playButton-pause");
      resumePauseBtnBg.classList.add("playButton-play");
    }
  }

  function resetSessionButton(disable) {
    resetBtn.disabled = disable;
  }

  function updateButtons(started, running) {
    //if started === true > enable pauseResume
    //if running === true > set pauseResume button to "Pause Timer"
    pauseResumeButton(started, running);
    //if started === true > enable resetSession button
    resetSessionButton(!started);

    updateDisplay(true, true, false);
  }

  function updateDisplay(tick, mode, duration) {
    if (tick) {
      displayTime();
    }
    if (mode) {
      displaySession();
    }
    if (duration) {
      displaySessionLengths();
    }
  }
  
  function changeBgColor(hasStarted, started, running) {
    //hasStarted = true after first time start
    //started = true whenever a certain session has ran
    //running = true when the current session is still running
    
    if (hasStarted === true && started === false && running === false) {
        timeSectionDiv.style.backgroundColor = "#d84315";
    }
    else {
        timeSectionDiv.style.backgroundColor = "#1e88e5";
    }
  }
  
  var audio = new Audio("alarm.mp3");
  function nextTimerSound() {
    audio.play();
  }

  return {
    updateDisplay: updateDisplay,
    updateButtons: updateButtons,
    changeBgColor: changeBgColor,
    playSound: nextTimerSound
  };

})();

*/
