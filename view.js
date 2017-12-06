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
    documentElements.workDurationTime = document.getElementById("workDuration");
    documentElements.sBreakDurationTime = document.getElementById("sBreakDuration");
    documentElements.lBreakDurationTime = document.getElementById("lBreakDuration");
    documentElements.durationChangeButtonList = document.querySelectorAll(".durBtn");
    documentElements.currentSession = document.getElementById("currentSession");
    documentElements.currentSessionNumber = document.getElementById("currentSessionNumber");
    documentElements.currentCycleLength = document.getElementById("currentCycleLength");
    documentElements.workUntilLong = document.getElementById("workUntilLong");    
    documentElements.resumePauseButton = document.getElementById("resumePauseTimer");
    documentElements.resetSessionButton = document.getElementById("resetSession");
    
    function changeResumePauseButton(action) {
        let newButtonName = action + "Timer";
        
        documentElements.resumePauseButton.name = newButtonName;
        documentElements.resumePauseButton.innerHTML = action;
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
    
    function updateCurrentSession(currSessName) {
        documentElements.currentSession.innerHTML = currSessName.type.fullName;
        documentElements.currentSessionNumber.innerHTML = currSessName.number;
        documentElements.currentCycleLength.innerHTML = currSessName.cycleLength;
        documentElements.workUntilLong.innerHTML = currSessName.workSessionsLeft;        
    }

    return {
        setStartTimerButton: setStartTimerButton,
        setPauseTimerButton: setPauseTimerButton,
        setResumeTimerButton: setResumeTimerButton,
        updateTime: updateTime,
        updateCurrentSession: updateCurrentSession
    };

})();



/* OLD CODE

var view = (function () {
  var sbDur = document.getElementById("sBreakDuration");
  var lbDur = document.getElementById("lBreakDuration");
  var wDur = document.getElementById("workDuration");

  var resumePauseBtnIcon = document.getElementById("resumePauseTimerIcon");
  var resumePauseBtnBg = document.querySelector(".playButton-play");
  
  let resetBtn = document.getElementById("resetSession");

  function displaySessionLengths() {
    var lengths = pomodoro.getSessionLengths();
    
    var oldWDur = wDur.innerHTML;
    var oldSbDur = sbDur.innerHTML;
    var oldLbDur = lbDur.innerHTML;
    
    var newWDur = lengths[0][1];
    var newSbDur = lengths[1][1];
    var newLbDur = lengths[2][1];
    
    wDur.innerHTML = newWDur;
    sbDur.innerHTML = newSbDur;
    lbDur.innerHTML = newLbDur;
  }
  
  function changePauseResumeButton(showPause) {
    if (showPause) {
      resumePauseBtnIcon.classList.remove("fa-play");
      resumePauseBtnIcon.classList.add("fa-pause");
      resumePauseBtnBg.classList.remove("playButton-play");
      resumePauseBtnBg.classList.add("playButton-pause");
    } else {
      resumePauseBtnIcon.classList.remove("fa-pause");
      resumePauseBtnIcon.classList.add("fa-play");
      resumePauseBtnBg.classList.remove("playButton-pause");
      resumePauseBtnBg.classList.add("playButton-play");
    }
  }

  function resetSessionButton(disable) {
    resetBtn.disabled = disable;
  }

  var audio = new Audio("alarm.mp3");
  function nextTimerSound() {
    audio.play();
  }

*/
