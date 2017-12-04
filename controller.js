/*jshint devel: true, esversion: 6, browser: true*/
/* globals timer, data*/

//interface between every other module
//no module can exchange information without it going through this module
//this means that every action and reaction possible (from the user in eventhandler, from the timer in timer.js, changing the display in view.js, changing and requesting data from data.js) goes through this module

var controller = (function() {
    
    function init() {
        //when page is loaded, call for a non-started timer to be created, with session work (and initial duration), and display this on the screen
    }
    
    function determineResumePauseButton(buttonName) {
        if (buttonName === "startTimer") {
            start();
        } else if (buttonName === "resumeTimer") {
            resume();
        } else if (buttonName === "pauseTimer") {
            pause();
        } else {
            console.log("Error! Button name of Resume/Pause button is not correct.");
        }
    }
    
    function start() {
        timer.start();
        data.setSessionPlayingProperties(true, false, true);
    }
    
    function resume() {
        timer.resume();
        data.setSessionPlayingProperties(true, false, true);
    }
    
    function pause() {
        timer.pause();
        data.setSessionPlayingProperties(true, true, false);
    }
    
    function changeDuration(session, sign) {
        
    }
    
    function resetDurations() {
        
    }
    
    function changeCycle() {
        
    }
    
    function resetSession() {
        
    }
    
    function resetTimer() {
        
    }
    
    function increaseSpeed() {
        
    }
    
    function skipSession() {
        
    }
    
    function sessionFinished() {
        
    }
    
    function timerTick() {
        //maybe remove this in favor of a request from data.js to update the view, and then controller collects data and checks what needs to be updated and what is still the same
    }
        
    return {
        init: init,
        determineResumePauseButton: determineResumePauseButton,
        start: start,
        resume: resume,
        pause: pause,
        changeDuration: changeDuration,
        resetDurations: resetDurations,
        changeCycle: changeCycle,
        resetSession: resetSession,
        resetTimer: resetTimer,
        increaseSpeed: increaseSpeed,
        skipSession: skipSession,
        sessionFinished: sessionFinished,
        timerTick: timerTick
    };
})();