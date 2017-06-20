/* global timer, pomodoro, progress */

var view = (function () {
  var timeP = document.getElementById("time");
  
  var sbDur = document.getElementById("sBreakDuration");
  var lbDur = document.getElementById("lBreakDuration");
  var wDur = document.getElementById("workDuration");

  var resumePauseBtnIcon = document.getElementById("resumePauseTimerIcon");
  var resumePauseBtnBg = document.querySelector(".playButton-play");
  
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
        cardHeaders[i].style.background = "#499df0";
      } else {
        cardHeaders[i].style.background = "#1976d2";
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
      resumePauseBtnIcon.classList.remove("fa-pause");
      resumePauseBtnIcon.classList.add("fa-play");
      resumePauseBtnBg.classList.remove("playButton-pause");
      resumePauseBtnBg.classList.add("playButton-play");
    } else if (started === true && running === false) {
      //text = Resume Session
      resumePauseBtnIcon.classList.remove("fa-pause");
      resumePauseBtnIcon.classList.add("fa-play");
      resumePauseBtnBg.classList.remove("playButton-pause");
      resumePauseBtnBg.classList.add("playButton-play");
    } else if (started === true && running === true) {
      //text = Pause Session
      resumePauseBtnIcon.classList.remove("fa-play");
      resumePauseBtnIcon.classList.add("fa-pause");
      resumePauseBtnBg.classList.remove("playButton-play");
      resumePauseBtnBg.classList.add("playButton-pause");
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

  return {
    updateDisplay: updateDisplay,
    updateButtons: updateButtons
  };

})();

var eventHandling = (function() {
  function resetSession() {
    timer.reset();
  }
  
  function resetTimer() {
    timer.reset();
    pomodoro.resetTimer();
  }
  
  function resumePauseTimer() {
    let mode = timer.getMode();
    
    let running = mode.running;
    let started = mode.started;
    
    view.updateButtons(started, running);
    
    if (started === false) {
      //start Timer
      timer.start();
    } else if (started === true && running === false) {
      //resume Timer
      timer.start();
    } else if (started === true && running === true) {
      //pause Timer
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
    var btns = document.querySelectorAll(".durBtn");
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
    
    if (amount < 2) {
      amount = 2;
      alert("Too low, minimum is 2. Amount of cycles is now 2.");
    } else if (amount > 10) {
      amount = 10;
      alert("Too high, maximum is 10. Amount of cycles is now 10.");
    } else if (Number.isInteger(amount) === false) {
      amount = 3;
      alert("Invalid number, number of cycles defaults to 3.");
    } else {
      amount = Number.parseInt(amount);
      alert("The cycle will be repeated " + amount + " times.");
    }    
    pomodoro.changeCycle(amount);    
  }
  
  return {
    resetSession: resetSession,
    resetTimer: resetTimer,
    resumePauseTimer: resumePauseTimer,
    changeSessionTime: changeSessionTime,
    resetDurations: resetDurations,
    changeCycle: changeCycle
  };
  
})();
