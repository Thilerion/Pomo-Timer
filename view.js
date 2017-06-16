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
  }

  function displaySession() {
    sessionP.innerHTML = pomodoro.getCurrent.longName();
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
  }
  
  function debugSkip() {
    console.log("TODO");
  }
  
  function resumePauseTimer() {
    let run = timer.getMode().running;
    view.pauseResumeButton(false, run);
    if (run === false) {
      timer.start();
    } else if (run === true) {
      timer.pause();
    }
  }

  function changeSessionTime(plus, session) {
    console.log(plus, session);
    if (plus === "in") {
      pomodoro.increaseDuration(session);
    } else if (plus === "de") {
      pomodoro.decreaseDuration(session);
    }
    if (session === pomodoro.currentSession.currentInfo.short) {
      timer.changeDuration(pomodoro.sessions[session].duration.current);
    }
    this.resetSession();
    view.displaySessionLengths();
  }

  function resetDurations() {
    console.log("TODO");
  }
  
  return {
    startTimer: startTimer,
    resetSession: resetSession,
    resetTimer: resetTimer,
    debugSkip: debugSkip,
    resumePauseTimer: resumePauseTimer,
    changeSessionTime: changeSessionTime,
    resetDurations: resetDurations
  };
  
})();
