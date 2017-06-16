var view = {
  displayTime: function() {
    var timeP = document.getElementById("time");
    var minutes = Math.round(timer.getMinutes());
    var seconds = Math.round(timer.getSeconds());
    timeP.innerHTML = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  },
  
  displaySession: function() {
    var sessionP = document.getElementById("session");
    sessionP.innerHTML = pomodoro.getCurrent.longName();
  },
  
  displaySessionLengths: function() {
    var sessionLengthsP = document.getElementById("sessionLengths");
    var lengths = pomodoro.getSessionLengths();
    sessionLengthsP.innerHTML = lengths[0][0] + ": " + lengths[0][1];
    sessionLengthsP.innerHTML += "; " + lengths[1][0] + ": " + lengths[1][1];
    sessionLengthsP.innerHTML += "; " + lengths[2][0] + ": " + lengths[2][1];
  },
  
  startButton: function(disable) {
    let startBtn = document.getElementById("startTimer");
    startBtn.disabled = disable;
  },
  
  pauseResumeButton: function(disable, mode) {
    //mode: true for resume text, false for pause text
    let resumePauseBtn = document.getElementById("resumePauseTimer");
    resumePauseBtn.disabled = disable;
    if (mode === false) {
      resumePauseBtn.innerHTML = "Pause Timer";
    } else if (mode === true) {
      resumePauseBtn.innerHTML = "Resume Timer";
    }    
  },
  
  resetSessionButton: function(disable) {
    let resetBtn = document.getElementById("resetSession");
    resetBtn.disabled = disable;
  },
  
  resetTimerButton: function(disable) {
    
  },
  
  updateButtons: function(started, running) {
    this.startButton(started);
    this.pauseResumeButton(!started, !running);
    this.resetSessionButton(!started);
    
    this.updateDisplay(true, true, false);
  },
  
  updateDisplay: function(tick, mode, duration) {
    if (tick) {
      this.displayTime();
    }
    if (mode) {
      this.displaySession();
    }
    if (duration) {
      this.displaySessionLengths();
    }
  }
};

var eventHandling = {
  startTimer: function() {
    timer.start();
  },
  
  resetSession: function() {
    timer.reset();
  },
  
  resetTimer: function() {
    timer.reset();
    //TODO
  },
  
  debugSkip: function() {
    //TODO
  },
  
  resumePauseTimer: function() {
    let run = timer.getMode().running;
    view.pauseResumeButton(false, run);
    if (run === false) {
      timer.start();
    } else if (run === true) {
      timer.pause();
    }
  },
  
  changeSessionTime: function(plus, session) {
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
  },
  
  resetDurations: function() {
    //TODO
  }
};