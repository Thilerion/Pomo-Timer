//interface between every other module
//no module can exchange information without it going through this module
//this means that every action and reaction possible (from the user in eventhandler, from the timer in timer.js, changing the display in view.js, changing and requesting data from data.js) goes through this module

var controller = (function() {
    
    function init() {
        //when page is loaded, call for a non-started timer to be created, with session work (and initial duration), and display this on the screen
    }
    
    function determineResumePauseButton() {
        //when the resumePauseButton is clicked, check which action is meant by this by checking the "currentSession" variable in data module
    }
    
    function start() {
        
    }
    
    function resume() {
        
    }
    
    function pause() {
        
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
        sessionFinished: sessionFinished
    };
})();