var stats = (function() {
  
  var _stats = {
    cycles: 0
  };
  
  var _log = {};
  
  var LogObj = {
    //prototype for every log entry
    overtime: function() {
      //sessionTime
      //this.finished - this.started - sessionTime = amount of time spent on session more than what was necessary
    }
  };
  
  function completeSession(start, finish, sessTime, sess) {
    let obj = Object.create(LogObj);
    
    obj.started = start;
    obj.finished = finish;
    obj.sessionTime = sessTime;
    obj.session = sess;
    
    _log.push(obj);    
  }
  
  function resetTimer() {    
    _stats.cycles = 0;
    _log = {};
  }
  
  function addOverTime(session, time) {
    var sessionVar = "_" + session;
  }
  
  return {
    resetTimer: resetTimer,
  };
  
})();