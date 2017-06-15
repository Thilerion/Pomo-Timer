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
    cycle: 0
  };
  
  function getCurrentSessionNumber() {
    return currentSession.session;
  }
  
  function getCurrentSessionName() {
    var num = getCurrentSessionNumber();
    return cycle[num];
  }
  
  function getCurrentSessionDuration() {
    var name = getCurrentSessionName();
    return sessions[name].duration.current;
  }
  //TODO: some way to store current name, number and duration, and change it each time a new timer begins
  
  function getSessionLengths() {
    let arr = [];
    for (var prop in sessions) {
      let inner = [];
      inner.push(sessions[prop].long, sessions[prop].duration.current);
      arr.push(inner);
    }
    return arr;
  }
  
  return {
    getCurrent: {
      number: getCurrentSessionNumber,
      name: getCurrentSessionName,
      duration: getCurrentSessionDuration
    },    
    getSessionLengths: getSessionLengths
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