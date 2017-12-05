/*jshint devel: true, esversion: 6, browser: true*/
/* globals timer, data, view*/

//interface between every other module
//no module can exchange information without it going through this module
//this means that every action and reaction possible (from the user in eventhandler, from the timer in timer.js, changing the display in view.js, changing and requesting data from data.js) goes through this module

var controller = (function () {

    function init(startingTime) {
        //when page is loaded, call for a non-started timer to be created, with session work (and initial duration), and display this on the screen
        data.init(startingTime);
        updateTimeView();
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
        data.increaseSessionNumber();
        data.resetTimeLeft();
        data.setNotStarted();
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

    function changeDuration(session, sign) {

    }

    function resetDurations() {

    }

    function changeCycle() {

    }

    function resetSession() {
        timer.pause();
        data.resetTimeLeft();
        data.setNotStarted();
        updateTimeView();
    }

    function resetTimer() {

    }

    function increaseSpeed() {
        //first check to see if timer should be paused and store this
        let props = data.getSessionPlayingProperties();
        let shouldResume = false;
        if (props.isPlaying === true) {
            shouldResume = true;
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
        if (shouldResume === true) {
            resume();
        }
    }

    function skipSession() {

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
        let curSes = data.getCurrentSessionInfo();
        console.log(curSes);
        view.updateCurrentSession(curSes);
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
        timerTick: timerTick
    };
})();

controller.init(7000);
