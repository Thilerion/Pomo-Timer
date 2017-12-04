/*jshint devel: true, esversion: 6, browser: true*/

/*
events to handle:
    resetSession
    resetTimer
    resumePauseTimer
    changeSessionTime
    resetDurations
    changeCycle
    changeSessionDurations
*/

//module for everything that handles events
var eventHandling = (function () {

    function resetSessionEvent() {
        //resets current timer, with timer set to initial time of current session, enabling the play/resume button
        
    }

    function resetTimerEvent() {
        //completely resets timers, returning to initial session
        
    }

    function resumePauseTimerEvent() {
        //checks whether timer has started or is running
        
    }

    function changeSessionTimeEvent(el) {
        //first checks to see which of the duration buttons is clicked
        //then sends this information to another module
        
        //registers the classes of "this", the button pressed
        let sessionToChange = [el.classList[1]];
        let signOfChange = [el.classList[0]];
        console.log("Event: " + signOfChange + " duration of " + sessionToChange);
    }

    function resetDurationsEvent() {
        //resets all session durations to their initial length
        
    }

    function changeCycleEvent() {
        //lets user adjust how many cycles before a long break
        
    }
    
    function increaseTimerSpeedEvent() {
        //increases speed at which timer runs, mainly for debugging purposes
        
    }
    
    function skipSessionEvent() {
        //skips current session to the end
        
    }

    return {
        resetSessionEvent: resetSessionEvent,
        resetTimerEvent: resetTimerEvent,
        resumePauseTimerEvent: resumePauseTimerEvent,
        changeSessionTimeEvent: changeSessionTimeEvent,
        resetDurationsEvent: resetDurationsEvent,
        changeCycleEvent: changeCycleEvent,
        increaseTimerSpeedEvent: increaseTimerSpeedEvent,
        skipSessionEvent: skipSessionEvent
    };
})();








/* OLD CODE

var eventHandling = (function() {
  function resetSession() {
    timer.reset();
  }
  
  function resetTimer() {
    pomodoro.hasStarted = false;
    timer.reset();
    pomodoro.resetTimer();
  }
  
  function resumePauseTimer() {
    let mode = timer.getMode();
    
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
  }
  
  function enableDurationButtons() {
    var btns = document.querySelectorAll(".durBtn");
    console.log(btns);
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = false;
    }
  }

  
  function changeCycle() {
    var amount = prompt("Choose how often the work-break should be repeated before a long break.", 3);
		amount = parseInt(amount); 
    
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


*/
