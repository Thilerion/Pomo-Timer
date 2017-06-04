/*
variables for work, sbreak, lbreak, sessions
convert those variables into text in the bar

set variable for current session: work, sbreak, lbreak
convert time for current session to minutes and seconds
put time into DOM

*/

/*
input:  minutes and seconds
          session duration
          session amount
output: current session
        number of cycles
        time to go until end of session
*/

var pomodoro = {
  sessions: {
    work: {
      short: "work",
      long: "Work",
      duration: {
        current: 25,
        max: 60,
        min: 15,
        initial: 25
      }
    },
    sBreak: {
      short: "sBreak",
      long: "Short Break",
      duration: {
        current: 5,
        max: 15,
        min: 2,
        initial: 5
      }
    },
    lBreak: {
      short: "lBreak",
      long: "Long Break",
      duration: {
        current: 20,
        max: 60,
        min: 5,
        initial: 20
      }
    }
  },
  cycle: ["work", "sBreak", "work", "sBreak", "work", "lBreak"],
  currentSession: {
    sessionNumber: 0,
    cycleNumber: 0,
    get currentInfo() {
      let name = pomodoro.cycle[pomodoro.currentSession.sessionNumber];
      return pomodoro.sessions[name];
    }
  },
  get sessionLengths() {
    let arr = [];
    for (var prop in pomodoro.sessions) {
      let inner = [];
      inner.push(pomodoro.sessions[prop].long, pomodoro.sessions[prop].duration.current);
      arr.push(inner);
    }
    return arr;
  },
  newTimer: function(duration) {
    duration *= 60000;
    timer = new Timer(duration);
  },
  timerFinished: function() {
    this.nextSession();
    let duration = this.currentSession.currentInfo.duration.current;
    this.newTimer(duration);
    view.updateFreshTimer();
  },
  nextSession: function() {
    if ((this.cycle.length - 1) <= this.currentSession.sessionNumber) {
      this.currentSession.sessionNumber = 0;
      this.currentSession.cycleNumber++;
      return;
    } else if ((this.cycle.length - 1) > this.currentSession.sessionNumber) {
      this.currentSession.sessionNumber++;
      return;
    } else {
      console.log("Error! Next session cannot be started!");
    }
  },
  increaseDuration: function(session) {
    if (this.sessions[session].duration.current + 1 > this.sessions[session].duration.max) {
      return "Error, max duration reached.";
    } else {
      this.sessions[session].duration.current++;
    }
  },
  decreaseDuration: function(session) {
    if (this.sessions[session].duration.current - 1 < this.sessions[session].duration.min) {
      return "Error, max duration reached.";
    } else {
      this.sessions[session].duration.current--;
    }    
  },
  changeCycle: function() {
    
  },
  //TODOOO BUTTON TO EXTEND PAUSE OR WORK FOR STATISTICSSSSSSS!!!
};


function Timer(ms) {
  //iedere keer als er een gestart/gestopt/gepauzeerd/gereset wordt of de duratie wordt veranderd, wordt er een nieuwe timer gemaakt
  
  //time left in ms when timer object is created
  this.initialTimeLeft = Math.floor(ms);
  
  //how much time is still left
  this.currentTimeLeft = this.initialTimeLeft;
  
  this.paused = null;
  
  Object.defineProperties(this, {
    "minutesLeft": {
      get: function() {
        return Math.floor(Math.round(this.currentTimeLeft / 1000) / 60 % 60);
      }
    },
    "secondsLeft": {
      get: function() {
        return Math.floor(Math.round(this.currentTimeLeft /1000) % 60);
      }
    },
    "millisecondsLeft": {
      get: function() {
        return this.currentTimeLeft % 1000;
      }
    }
  });
}

Timer.prototype.startTimer = function() {
  var that = this;
  this.paused = false;

  //decrease time left by 1 second to reduce delay after clicking button
  this.currentTimeLeft -= 1000;
  
  //the timer should end "Time Left" after "t=0" which is the start time
  this.endTime = Date.now() + this.currentTimeLeft;
  
  view.updateStartTimer();
  
  that.interval = setInterval(that.intervalTimer.bind(that), 1000);
};

Timer.prototype.intervalTimer = function() {
  //called by this.interval every 1000 ms
  
  //<50 to account for timer inaccuracies
  if (this.currentTimeLeft - 1000 < 50) {
    this.currentTimeLeft = 0;
    view.updateIntervalTimer();
    this.finishedTimer();
  } else {
    this.currentTimeLeft = this.endTime - Date.now();
    view.updateIntervalTimer();
  }  
  
  //for debugging
  console.log(this.currentTimeLeft, this.millisecondsLeft, this.secondsLeft, this.minutesLeft);
  
};

Timer.prototype.resetTimer = function() {
  this.clearInterval();
  
  //reset currentTimeLeft by taking initialTimeLeft
  this.currentTimeLeft = this.initialTimeLeft;
  this.paused = null;
  view.updateFreshTimer();
};

Timer.prototype.changeDuration = function(duration) {
  this.initialTimeLeft = duration * 60000;
};


Timer.prototype.pauseTimer = function() {
  this.clearInterval();
  this.paused = true;
  view.updatePauseTimer();
};


Timer.prototype.finishedTimer = function() {
  this.clearInterval();
  pomodoro.timerFinished();
};

Timer.prototype.clearInterval = function() {
  //TODO: misschien kijken of interval al gecleared is? met paused boolean?
  var that = this;
  clearInterval(that.interval);
};

var view = {
  displayTime: function() {
    var timeP = document.getElementById("time");
    var minutes = Math.round(timer.minutesLeft);
    var seconds = Math.round(timer.secondsLeft);
    timeP.innerHTML = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  },
  displaySession: function() {
    var sessionP = document.getElementById("session");
    sessionP.innerHTML = pomodoro.currentSession.currentInfo.long;
  },
  displaySessionLengths: function() {
    var sessionLengthsP = document.getElementById("sessionLengths");
    var lengths = pomodoro.sessionLengths;
    sessionLengthsP.innerHTML = lengths[0][0] + ": " + lengths[0][1];
    sessionLengthsP.innerHTML += "; " + lengths[1][0] + ": " + lengths[1][1];
    sessionLengthsP.innerHTML += "; " + lengths[2][0] + ": " + lengths[2][1];
  },
  updateFreshTimer: function() {
    //Timer finished and reset timer
    this.displayTime();
    this.displaySession();
    this.displaySessionLengths();
    //disable reset timer button
    let resetBtn = document.getElementById("resetTimer");
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
    //enable reset timer button
    let resetBtn = document.getElementById("resetTimer");
    resetBtn.disabled = false;
    //disable start button
    let startBtn = document.getElementById("startTimer");
    startBtn.disabled = true;
    //set pause/resume button to "pause"
    resumePauseBtn.value = "Pause Timer";
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
    resumePauseBtn.value = "Resume Timer";
  }
};

var eventHandling = {
  startTimer: function() {
    timer.startTimer();
  },
  resetTimer: function() {
    timer.resetTimer();
  },
  debugSkip: function() {
    timer.clearInterval();
    timer.currentTimeLeft = 6000;
    timer.startTimer();
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
    this.resetTimer();
    view.displaySessionLengths();
  }
};

//TODO: Add complete reset, and add the complete reset to change session time


var timer;
pomodoro.newTimer(25);
view.updateFreshTimer();
console.log(timer.minutesLeft);
console.log(timer.secondsLeft);
console.log(timer.millisecondsLeft);
//x.startTimer();


