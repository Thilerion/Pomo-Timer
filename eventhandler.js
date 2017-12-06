/*jshint devel: true, esversion: 6, browser: true*/
/* globals controller */

var eventHandling = (function () {

    function resetSessionEvent() {
        //resets current timer, with timer set to initial time of current session, enabling the play/resume button
        controller.resetSession();
    }

    function resetTimerEvent() {
        //completely resets timers, returning to initial session        
    }

    function resumePauseTimerEvent(el) {
        //checks whether timer has started or is running
        let buttonName = el.name;
        controller.determineResumePauseButton(buttonName);
        
        console.log("This button can start, resume or pause");
        console.log("It is now configured for: " + buttonName);
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
        controller.changeCycle();
    }
    
    function changeTimerSpeedEvent() {        
        controller.increaseSpeed();
    }
    
    function skipSessionEvent() {
        //skips current session to the end
        controller.skipSession();
    }

    return {
        resetSessionEvent: resetSessionEvent,
        resetTimerEvent: resetTimerEvent,
        resumePauseTimerEvent: resumePauseTimerEvent,
        changeSessionTimeEvent: changeSessionTimeEvent,
        resetDurationsEvent: resetDurationsEvent,
        changeCycleEvent: changeCycleEvent,
        changeTimerSpeedEvent: changeTimerSpeedEvent,
        skipSessionEvent: skipSessionEvent
    };
})();








/* OLD CODE

var eventHandling = (function() {
  
  function resetTimer() {
    pomodoro.hasStarted = false;
    timer.reset();
    pomodoro.resetTimer();
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

*/
