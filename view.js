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
  updateFreshTimer: function() {
    //Timer finished and reset timer
    this.displayTime();
    this.displaySession();
    this.displaySessionLengths();
    //disable reset session button
    let resetBtn = document.getElementById("resetSession");
    resetBtn.disabled = true;
    //enable start button
    let startBtn = document.getElementById("startTimer");
    startBtn.disabled = false;
    //disable pause/resume button
    let resumePauseBtn = document.getElementById("resumePauseTimer");
    resumePauseBtn.disabled = true;
  },
  updateStartTimer: function() {
    //Timer starts
    this.displayTime();
    //enable pause/resume button
    let resumePauseBtn = document.getElementById("resumePauseTimer");
    resumePauseBtn.disabled = false;
    //enable reset session button
    let resetBtn = document.getElementById("resetSession");
    resetBtn.disabled = false;
    //disable start button
    let startBtn = document.getElementById("startTimer");
    startBtn.disabled = true;
    //set pause/resume button to "pause"
    resumePauseBtn.innerHTML = "Pause Timer";
  },
  updateIntervalTimer: function() {
    //every tick of the interval
    this.displayTime();
  },
  updatePauseTimer: function() {
    //Timer paused
    this.displayTime();
    //set pause/resume button to "resume"
    let resumePauseBtn = document.getElementById("resumePauseTimer");
    resumePauseBtn.innerHTML = "Resume Timer";
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
    if (timer.paused === true) {
      timer.startTimer();
    } else if (timer.paused === false) {
      timer.pauseTimer();
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
    pomodoro.resetDurations();   timer.changeDuration(pomodoro.sessions[pomodoro.currentSession.currentInfo.short].duration.current);
    this.resetSession();
  }
};