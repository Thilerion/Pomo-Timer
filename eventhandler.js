/*jshint devel: true, esversion: 6, browser: true*/
/* globals controller */

var eventHandling = (function () {

    function resetSessionEvent() {
        controller.resetSession();
    }

    function resetTimerEvent() {
        controller.resetTimer();
    }

    function resumePauseTimerEvent(el) {
        let buttonName = el.name;
        controller.determineResumePauseButton(buttonName);
        
        console.log("This button can start, resume or pause");
        console.log("It is now configured for: " + buttonName);
    }

    function changeSessionTimeEvent(el) {        
        //registers the classes of "this", the button pressed
        let sessionToChange = [el.classList[1]];
        let signOfChange = [el.classList[0]];
        
        //function uses loose equality as classList returns an array with only 1 value
        if (sessionToChange == "sBreak") {
            sessionToChange = "short";
        } else if (sessionToChange == "lBreak") {
            sessionToChange = "long";
        } else if (sessionToChange == "work") {
            sessionToChange = "work";
        } else {
            console.log("Error! Don't understand which session to change.");
            return; 
        }
        
        let amount = 0;
        
        if (signOfChange == "increase") {
            amount = 1;
        } else if (signOfChange == "decrease") {
            amount = -1;
        } else {
            console.log("Error! No amount detected.");
        }
        
        controller.changeDuration(sessionToChange, amount);
    }

    function resetDurationsEvent() {
        controller.resetDurations();
    }

    function changeCycleEvent() {
        controller.changeCycle();
    }
    
    function changeTimerSpeedEvent() {        
        controller.increaseSpeed();
    }
    
    function skipSessionEvent() {
        controller.skipSession();
    }
    
    function toggleSound(el) {
        console.log(el.firstElementChild.classList);
        el.firstElementChild.classList.toggle("fa-volume-off");
        el.firstElementChild.classList.toggle("fa-volume-up");
        console.log(el.firstElementChild.classList);
        
        let soundOn;
        
        if (el.firstElementChild.classList.contains("fa-volume-up")) {
            soundOn = true;
        } else {
            soundOn = false;
        }
        
        controller.toggleSound(soundOn);
    }

    return {
        resetSessionEvent: resetSessionEvent,
        resetTimerEvent: resetTimerEvent,
        resumePauseTimerEvent: resumePauseTimerEvent,
        changeSessionTimeEvent: changeSessionTimeEvent,
        resetDurationsEvent: resetDurationsEvent,
        changeCycleEvent: changeCycleEvent,
        changeTimerSpeedEvent: changeTimerSpeedEvent,
        skipSessionEvent: skipSessionEvent,
        toggleSound: toggleSound
    };
})();