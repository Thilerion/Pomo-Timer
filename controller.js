/*jshint devel: true, esversion: 6, browser: true*/
/* globals timer, data, view*/

var controller = (function () {

    function init(startingTime) {
        //when page is loaded, call for a non-started timer to be created, with session work (and initial duration), and display this on the screen
        data.init(startingTime);
        updateTimeView();
        updateCurrentSessionView();
        updateEverySessionDuration();
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
        data.setStartedPlaying();
        updateTimeView();
    }

    function resume() {
        timer.resume();
        data.setStartedPlaying();
        updateTimeView();
    }

    function pause() {
        timer.pause();
        data.setPaused();
        updateTimeView();
    }

    function finishedSession() {
        timer.pause();
        data.setNotStarted();
        data.increaseSessionNumber();
        data.resetTimeLeft();        
        updateTimeView();
        updateCurrentSessionView();
    }

    function changeResumePauseButton() {
        let props = data.getSessionPlayingProperties();
        let action;

        if (props.hasStarted === false) {
            view.setStartTimerButton();
        } else if (props.hasStarted === true && props.isPlaying === false) {
            view.setResumeTimerButton();
        } else if (props.hasStarted === true && props.hasStarted === true) {
            view.setPauseTimerButton();
        } else {
            console.log("Error in controller: props gives wrong session playing information");
        }
    }

    function changeDuration(sess, amount) {
        //sess: short, long, work
        //amount: -1, 1 (or 0 if error)
        let amountMS = data.convertToMS(amount);
        data.changeDuration(sess, amountMS);
        updateSingleSessionDuration(sess);        
    }
    
    function updateSingleSessionDuration(sess) {
        let durationsInfo = data.getSessionsCurrentDuration();
        let sessDurMinutes = data.convertToMinSec(durationsInfo[sess]).min;
        view.updateSingleDurationTime(sess, sessDurMinutes);
    }
    
    function updateEverySessionDuration() {
        let durationsInfo = data.getSessionsCurrentDuration();
        for (const prop in durationsInfo) {
            let amount = durationsInfo[prop];
            amount = data.convertToMinSec(amount).min;
            view.updateSingleDurationTime(prop, amount);
        }
    }

    function resetDurations() {
        data.resetAllDurations();
        updateEverySessionDuration();
    }

    function changeCycle() {
        //REMINDER TO SELF: what to do when the cycle is changed, which means the user is ahead of the cycle?
        let shouldPause = checkIfShouldPause();
        if (shouldPause === true) {
            pause();
        }
        
        let currLength = data.getCycleLength();
        
        let inputLength = prompt("How many work sessions before a longer break? (min 2, max 8)", currLength);
        inputLength = parseInt(inputLength);
        if (Number.isNaN(inputLength) || inputLength < 2 || inputLength > 8) {
            alert("Invalid value, multiplier stays the same (" + currLength + ").");
        } else {
            alert("The amount of work sessions before a long break will be changed to " + inputLength);
            data.setCycleLength(inputLength);
        }
        
        if (shouldPause === true) {
            resume();
        }
        updateCurrentSessionView();
    }

    function resetSession() {
        timer.pause();
        data.resetTimeLeft();
        if (data.getSessionPlayingProperties().hasStarted === true) {
            data.setPaused();
        } else {
            data.setNotStarted();
        }
        updateTimeView();
    }

    function resetTimer() {
        timer.pause();
        data.resetAll();        
        data.setNotStarted();
        updateTimeView();
        updateCurrentSessionView();
    }
    
    function checkIfShouldPause() {
        let props = data.getSessionPlayingProperties();
        if (props.isPlaying === true) {
            return true;
        } else if (props.isPlaying === false) {
            return false;
        }
    }

    function increaseSpeed() {
        //first check to see if timer should be paused and store this
        let shouldPause = checkIfShouldPause();
        if (shouldPause === true) {
            pause();
        }
        
        let currSpeedMult = data.getSpeedMult();
        let nMult = prompt("How much should the speed by multiplied? (min 1, max with interval 25, total max 300)", currSpeedMult);
        if (Number.isNaN(parseInt(nMult))) {
            alert("Invalid value, multiplier stays the same (" + currSpeedMult + ").");
        } else if (parseInt(nMult) < 1 || parseInt(nMult) > 300) {
            alert("Invalid value, multiplier stays the same (" + currSpeedMult + ").");
        } else {
            alert("Timer speed will be multiplied by " + parseInt(nMult) + ".");
            data.setSpeedMult(parseInt(nMult));
        }
        //if the timer was paused because of this, resume again
        if (shouldPause === true) {
            resume();
        }
    }

    function skipSession() {
        //check if should be paused first
        let props = data.getSessionPlayingProperties();
        if (props.isPlaying === true) {
            pause();
        }
        data.skipSession();
        start();
    }

    function timerTick() {
        //maybe remove this in favor of a request from data.js to update the view, and then controller collects data and checks what needs to be updated and what is still the same
        updateTimeView();
    }

    function updateTimeView() {
        let tms = data.getTimeLeft();
        let t = data.convertToMinSec(tms);
        view.updateTime(t);
    }

    function updateCurrentSessionView() {
        let curSesInfo = data.getCurrentSessionInfo();
        console.log(curSesInfo);
        view.updateCurrentSession(curSesInfo);
    }
    
    function durationLimitReached(session, sign) {
        console.log("Apparently, " + session + " has reached maximum/minimum (" + sign + ").");
        view.disableDurationButton(session, sign);
    }

    return {
        init: init,
        determineResumePauseButton: determineResumePauseButton,
        changeResumePauseButton: changeResumePauseButton,
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
        finishedSession: finishedSession,
        timerTick: timerTick,
        durationLimitReached: durationLimitReached
    };
})();

controller.init();
