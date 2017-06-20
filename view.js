/* global timer, pomodoro, progress */

var view = (function () {
  var timeP = document.getElementById("time");
  var sessionP = document.getElementById("session");
  var sessionLengthsP = document.getElementById("sessionLengths");

  var startBtn = document.getElementById("startTimer");
  var resumePauseBtn = document.getElementById("resumePauseTimer");
  let resetBtn = document.getElementById("resetSession");
  
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
    sessionP.innerHTML = pomodoro.getCurrent().longName;
  }

  function displaySessionLengths() {
    var lengths = pomodoro.getSessionLengths();
    sessionLengthsP.innerHTML = lengths[0][0] + ": " + lengths[0][1];
    sessionLengthsP.innerHTML += "; " + lengths[1][0] + ": " + lengths[1][1];
    sessionLengthsP.innerHTML += "; " + lengths[2][0] + ": " + lengths[2][1];
  }

  function startButton(disable) {
    startBtn.disabled = disable;
  }

  function pauseResumeButton(disable, mode) {
    resumePauseBtn.disabled = disable;
    if (mode === false) {
      resumePauseBtn.innerHTML = "Pause Timer";
    } else if (mode === true) {
      resumePauseBtn.innerHTML = "Resume Timer";
    }
  }

  function resetSessionButton(disable) {
    resetBtn.disabled = disable;
  }

  function updateButtons(started, running) {
    startButton(started);
    pauseResumeButton(!started, !running);
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

  return {
    updateDisplay: updateDisplay,
    updateButtons: updateButtons
  };

})();

var eventHandling = (function() {
  function startTimer() {
    timer.start();
  }
  
  function resetSession() {
    timer.reset();
  }
  
  function resetTimer() {
    timer.reset();
    pomodoro.resetTimer();
  }
  
  function debugSkip() {
    timer.debugSkip();
  }
  
  function resumePauseTimer() {
    let run = timer.getMode().running;
    view.updateButtons(false, run);
    if (run === false) {
      timer.start();
    } else if (run === true) {
      timer.pause();
    }
  }

  function changeSessionTime(el) {
    var classes = [el.classList[0], el.classList[1]];
    console.log(classes);
    var amount = (classes[0] === "increase") ? 1 : -1;
    console.log(amount);
    var session = classes[1];
    console.log(session);
    
    var disable = pomodoro.changeLength(session, amount);
    
    if (disable === true) {
      el.disabled = true;
    } else if (disable === false) {
      var select = "." + session;
      var sessionBtns = document.querySelectorAll(select);
      for (var i = 0; i < 2; i++) {
        sessionBtns[i].disabled = false;
      }
    }
    
    view.updateDisplay(false, false, true);
  }
  
  function enableDurationButtons() {
    var btns = document.querySelectorAll(".underSection-buttonContainer > button");
    console.log(btns);
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = false;
    }
  }

  function resetDurations() {
    pomodoro.resetDurations();
    enableDurationButtons();
    view.updateDisplay(true, true, true);
  }
  
  function changeCycle() {
    var amount = prompt("Choose how often the work-break should be repeated before a long break.", 3);
    pomodoro.changeCycle(amount);
    alert("The cycle will be repeated " + amount + " times.");
  }
  
  return {
    startTimer: startTimer,
    resetSession: resetSession,
    resetTimer: resetTimer,
    debugSkip: debugSkip,
    resumePauseTimer: resumePauseTimer,
    changeSessionTime: changeSessionTime,
    resetDurations: resetDurations,
    changeCycle: changeCycle
  };
  
})();
