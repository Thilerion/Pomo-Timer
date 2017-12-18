/*jshint devel: true, esversion: 6, browser: true*/

/*
things to change in display:
    disable resetsession button
*/

var view = (function () {
    //module whose only function is to change the view
    //first declares variables for each element in the document that can be changed
    let documentElements = {};
    documentElements.time = document.getElementById("time");
    documentElements.duration = {};
    documentElements.duration.work = document.getElementById("workDuration");
    documentElements.duration.short = document.getElementById("sBreakDuration");
    documentElements.duration.long = document.getElementById("lBreakDuration");
    documentElements.durationChangeButtonList = document.querySelectorAll(".durBtn");
    documentElements.currentSession = document.getElementById("currentSession");
    documentElements.currentSessionNumber = document.getElementById("currentSessionNumber");
    documentElements.currentCycleLength = document.getElementById("currentCycleLength"); 
    documentElements.resumePauseButton = document.getElementById("resumePauseTimer");
    documentElements.resetSessionButton = document.getElementById("resetSession");
    
    let alarmSound = new Audio("alarm.mp3");
    
    function changeResumePauseButton(action) {
        if (action === "start" || action === "resume") {
            documentElements.resumePauseButton.innerHTML = '<i class="fa fa-play"></i>';
        } else if (action === "pause") {
            documentElements.resumePauseButton.innerHTML = '<i class="fa fa-pause"></i>';
        }
        
        documentElements.resumePauseButton.name = action + "Timer";
    }
    
    function updateSingleDurationTime(sess, dur) {
        console.log("Changing view of " + sess + " to " + dur);
        documentElements.duration[sess].innerHTML = dur;
    }
    
    function setStartTimerButton() {
        changeResumePauseButton("start");
    }
    
    function setPauseTimerButton() {
        changeResumePauseButton("pause");
    }
    
    function setResumeTimerButton() {
        changeResumePauseButton("resume");
    }
    
    function updateTime(obj) {
        documentElements.time.innerHTML = ("0" + obj.min).slice(-2) + ":" + ("0" + obj.sec).slice(-2);
    }
    
    function disableDurationButton(session, disable, sign) {        
        if (session == "short") {
            session = "sBreak";
        } else if (session == "long") {
            session = "lBreak";
        }
        
        if (sign == "min") {
            sign = "decrease";
        } else if (sign == "max") {
            sign = "increase";
        }
        
        let query = "." + sign + "." + session;
        
        let toDisable = document.querySelector(query);
        toDisable.disabled = disable;
    }
    
    function playFinishedSessionSound() {
        alarmSound.play();      
    }
    
    let mainTimeBox = document.querySelector(".main-time-box");
    let workBackground = document.querySelector(".main-time-box-bg-work");
    let shortBackground = document.querySelector(".main-time-box-bg-short");
    let longBackground = document.querySelector(".main-time-box-bg-long");
    
    function setBoxColor(session) {
        if (session === "work") {
            mainTimeBox.style.setProperty("--box-color", "var(--work-color-5)");
            mainTimeBox.style.setProperty("--box-color-light", "var(--work-color-4)");
            mainTimeBox.style.setProperty("--box-color-dark", "var(--work-color-6)");
            workBackground.style.opacity = 1;
            longBackground.style.opacity = 0;
            shortBackground.style.opacity = 0;
        } else if (session === "short") {
            mainTimeBox.style.setProperty("--box-color", "var(--short-color-5)");
            mainTimeBox.style.setProperty("--box-color-light", "var(--short-color-4)");
            mainTimeBox.style.setProperty("--box-color-dark", "var(--short-color-6)");
            workBackground.style.opacity = 0;
            longBackground.style.opacity = 0;
            shortBackground.style.opacity = 1;
        } else if (session === "long") {
            mainTimeBox.style.setProperty("--box-color", "var(--long-color-5)");
            mainTimeBox.style.setProperty("--box-color-light", "var(--long-color-4)");
            mainTimeBox.style.setProperty("--box-color-dark", "var(--long-color-6)");
            workBackground.style.opacity = 0;
            longBackground.style.opacity = 1;
            shortBackground.style.opacity = 0;
        }
    }

    return {
        setStartTimerButton: setStartTimerButton,
        setPauseTimerButton: setPauseTimerButton,
        setResumeTimerButton: setResumeTimerButton,
        updateTime: updateTime,
        updateSingleDurationTime: updateSingleDurationTime,
        disableDurationButton: disableDurationButton,
        playFinishedSessionSound: playFinishedSessionSound,
        setBoxColor: setBoxColor
    };

})();