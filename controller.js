/*jshint devel: true, esversion: 6, browser: true*/
/* globals timer, data, view, timeline*/

var controller = (function () {

    function init() {
        //only run once, when all modules are loaded
        data.init();
        updateTimeView();
        updateTimeLineCircles();
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
        data.start();
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        updateActivatedCircles();
    }

    function resume() {
        timer.resume();
        data.start();
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        updateActivatedCircles();
    }

    function pause() {
        timer.pause();
        data.pause();
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        updateActivatedCircles();
    }

    function finishedSession() {
        updateActivatedCircles();
        timer.pause();
        data.finish();  
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        view.playFinishedSessionSound();
    }

    function changeResumePauseButton() {
        let props = data.getPlayingProps();
        let action;

        if (props.started === false) {
            view.setStartTimerButton();
        } else if (props.started === true && props.playing === false) {
            view.setResumeTimerButton();
        } else if (props.started === true && props.playing === true) {
            view.setPauseTimerButton();
        } else {
            console.log("Error in controller: props gives wrong session playing information");
        }
    }

    function changeDuration(sess, amount) {
        //sess: short, long, work
        //amount: -1, 1 (or 0 if error)
        data.changeDuration(sess, amount);
        updateSingleSessionDuration(sess);        
    }
    
    function updateSingleSessionDuration(sess) {
        let durationsInfo = data.getAllCurrentDurations();
        let sessDur = durationsInfo[sess];
        view.updateSingleDurationTime(sess, sessDur);
    }
    
    function updateEverySessionDuration() {
        let durationsInfo = data.getAllCurrentDurations();
        for (const prop in durationsInfo) {
            let amount = durationsInfo[prop];
            view.updateSingleDurationTime(prop, amount);
        }
    }

    function resetDurations() {
        data.resetAllDurations();
        updateEverySessionDuration();
    }

    function changeCycle() {
        resetTimer();
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
        updateTimeLineCircles();
    }

    function resetSession() {
        timer.pause();
        data.resetSession();
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        updateActivatedCircles();
    }

    function resetTimer() {
        timer.pause();
        data.resetAll();
        changeResumePauseButton();
        updateTimeView();
        updateTimeLineCircles();
        updateActivatedCircles();
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
        let props = data.getPlayingProps();
        if (props.playing === true) {
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

    function updateTimeLineCircles() {
        //let cycleLength = data.getCycleLength();
        //timeline.createCircles(cycleLength);
        let sesAr = data.getCycleInfo();
        timeline.initTimeline(sesAr[0], sesAr[1]);
    }
    
    function updateActivatedCircles() {
        let sessionInfo = data.getCurrentSessionInfo();
        console.log(sessionInfo);
        //timeline.updateActiveCircles(sessionInfo);
    }
    
    function checkDurationDisabled(session, disable, sign) {
        console.log("Apparently, " + session + " has reached " + sign + ".");
        view.disableDurationButton(session, disable, sign);
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
        checkDurationDisabled: checkDurationDisabled,
        updateActivatedCircles: updateActivatedCircles
    };
})();

controller.init();
