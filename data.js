var pomodoro = (function () {
  var sessions = {
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
  };
  
  var cycle = ["work", "sBreak", "work", "sBreak", "work", "lBreak"];
  
  var currentSession = {
    session: 0,
    name: "work",
    longName: "Work",
    length: 25,
    cycle: 0
  };
  
  function getCurrentSessionInfo() {
    return currentSession;
  }
  
  function getSessionLengths() {
    let arr = [];
    for (var prop in sessions) {
      let inner = [];
      inner.push(sessions[prop].long, sessions[prop].duration.current);
      arr.push(inner);
    }
    return arr;
  }
  
  function changeSessionLength(session, amount) {
    let cur = sessions[session].duration.current;
    let max = sessions[session].duration.max;
    let min = sessions[session].duration.min;    
    
    console.log(cur + " was the length of " + session);
    cur += amount;
    console.log(cur + " is the new length of " + session);
    
    sessions[session].duration.current = cur;
    
    if (cur >= max || cur <= min) {
      return true;
    } else {
      return false;
    }
  }
  
  function finishedTimer() {
    nextTimer();
    timer.init(currentSession.length);
  }
  
  function nextTimer() {
    var end = (currentSession.session + 1 >= cycle.length) ? true : false;
    
    if (end) {
      currentSession.session = 0;
      currentSession.cycle++;
    } else {
      currentSession.session++;
    }
    
    buildCurrentSessionData();
  }
  
  function buildCurrentSessionData() {
    currentSession.name = cycle[currentSession.session];
    currentSession.longName = sessions[currentSession.name].long;
    currentSession.length = sessions[currentSession.name].duration.current;
  }
  
  function resetTimer() {
    currentSession.session = 0;
    currentSession.cycle = 0;
    buildCurrentSessionData();
    timer.init(currentSession.length);
  }
  
  return {
    getCurrent: getCurrentSessionInfo,
    getSessionLengths: getSessionLengths,
    finishedTimer: finishedTimer,
    changeLength: changeSessionLength,
    resetTimer: resetTimer
  };
  
})();

/*
missing:
  newTimer
  timerFinished
  nextSession
  increaseDuration
  decreaseDuration
  changeCycle
  resetTimer
  resetDurations
  init function
*/