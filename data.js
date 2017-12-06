/*jshint devel: true, esversion: 6, browser: true*/
/* globals controller */

/*
but also long-term information:
    totalTimePlayed
    totalSessions
    amountOfPauses
    timeWorked
    timePaused
    etc etc
*/

var data = (function() {
    //the session variable contains all information about the different session types
    var sessions = {};
    
    //creates a prototype from which sessions are made
    function Session(name, fullName, initialDur, maxDur, minDur) {
        this.name = name;
        this.fullName = fullName;
        this.dur = {};
        this.dur.current = this.dur.initial = convertToMS(initialDur);
        this.dur.max = convertToMS(maxDur);
        this.dur.min = convertToMS(minDur);
    }
    
    //adds method to prototype to reset duration to initial duration
    Session.prototype.resetDur = function() {
        this.dur.current = this.dur.initial;
        console.log("Duration of " + this.fullName + " has been reset to " + this.dur.current);
    };
    
    Session.prototype.increaseDur = function() {
        this.dur.current += 60000;
        console.log("Duration of " + this.long + " has been increased by one minute to " + this.dur.current + " ms");
    };
    
    Session.prototype.decreaseDur = function() {
        this.dur.current -= 60000;
        console.log("Duration of " + this.long + " has been decreased by one minute to " + this.dur.current + " ms");
    };
    
    //creates the three session types and assigns them to the above "sessions" variable
    sessions.work = new Session("work", "Work", 25, 60, 25);
    sessions.short = new Session("short", "Short Break", 5, 15, 2);
    sessions.long = new Session("long", "Long Break", 20, 60, 5);
    
    var currentSession = {
        "type": "work",
        "sessionNumber": 1,
        "cyclesBeforeLong": 3,
        "hasStarted": false,
        "isPlaying": false,
        //checks to see what the initial duration is
        "dur": function() {
            let sess = currentSession.type;
            return sessions[sess].dur.current;
        },
        "timeLeft": null, //starting time in ms, maybe change on init...
        "speedMult": 1
    };
    
    function changeDuration(sess, amount) {
        let currentDuration = sessions[sess].dur.current;
        let newDuration = (currentDuration + amount);
        sessions[sess].dur.current = newDuration;        
    }
    
    function getSessionsCurrentDuration() {
        let ret = {};
        for (const s in sessions) {
            ret[s] = sessions[s].dur.current;
        }
        console.log(ret);
        return ret;
    }
    
    function resetAllDurations() {
        for (const s in sessions) {
            sessions[s].resetDur();
        }
    }
    
    function convertToMS(min) {
        return min * 60000;
    }
    
    function convertToMinSec(ms) {
        return {
            min: Math.floor(Math.round(ms / 1000) / 60 % 60),
            sec: Math.floor(Math.round(ms / 1000) % 60)
        };
    }
    
    function decreaseTimeLeft(n) {
        if (currentSession.timeLeft - n < 100) {
            currentSession.timeLeft = 100;
            controller.finishedSession();
        } else {
            currentSession.timeLeft -= n;
        }        
    }
    
    function increaseTimeLeft(n) {
        currentSession.timeLeft += n;
    }
    
    function getTimeLeft() {
        if (currentSession.timeLeft) {
            return currentSession.timeLeft;
        } else {
            currentSession.timeLeft = currentSession.dur();
            console.log("No session duration initialized! Defaulting to current session init duration.");
            return currentSession.timeLeft;
        }
    }
    
    function resetTimeLeft() {
        //resets timeLeft according to the duration of the current session
        currentSession.timeLeft = currentSession.dur();
    }
    
    function skipSession() {
        currentSession.timeLeft = 3000;
    }
    
    function getSpeedMult() {
        return currentSession.speedMult;
    }
    
    function setSpeedMult(mult) {
        let updSpeedMult = parseInt(mult);
        currentSession.speedMult = parseInt(Math.floor(updSpeedMult));
        console.log("New speed multiplier is: " + currentSession.speedMult);
    }
    
    function getIntervalTime() {
        let s = currentSession.speedMult;
        let i = 1000 / currentSession.speedMult;
        console.log("Current speed mult is: " + s + ", so interval time should be: " + i);
        if (i < 40) {
            console.log("Defaulting to a minimum interval time of 40 ms.");
            i = 40;
        } else if (i > 1000) {
            console.log("Defaulting to a maximum interval time of 1000 ms.");
            i = 1000;
        } else {
            i = Math.floor(i);
            console.log("Interval time is rounded to " + i);
        }
        return i;
    }
    
    function setStartedPlaying() {
        currentSession.hasStarted = true;
        currentSession.isPlaying = true;
        controller.changeResumePauseButton();
    }
    
    function setPaused() {
        currentSession.hasStarted = true;
        currentSession.isPlaying = false;
        controller.changeResumePauseButton();
    }
    
    function setNotStarted() {
        currentSession.hasStarted = false;
        currentSession.isPlaying = false;
        controller.changeResumePauseButton();
    }
    
    function getSessionPlayingProperties() {
        return {
            hasStarted: currentSession.hasStarted,
            isPlaying: currentSession.isPlaying
        };
    }
    
    function init(startingTime) {
        //for testing purposes, allows changing initial time on window load (controller)
        currentSession.timeLeft = startingTime;
    }
    
    function getCurrentSessionInfo() {
        let t = sessions[currentSession.type];
        let n = currentSession.sessionNumber;
        return {
            type: t,
            number: n,
            cycleLength: getCycleLength(),
            workSessionsLeft: calcWorkSessionsLeft(n, getCycleLength())
        };
    }
    
    function calcWorkSessionsLeft(curSesN, cycleLength) {
        return (cycleLength - Math.floor(curSesN/2));
    }
    
    function getNumberOfSessionsBeforeLong() {
        //minus one because the long break takes the place of the last short break
        return parseInt((currentSession.cyclesBeforeLong * 2)-1);
    }
    
    function getCycleLength() {
        return currentSession.cyclesBeforeLong;
    }
    
    function setCycleLength(n) {
        currentSession.cyclesBeforeLong = n;
    } 
    
    function restartCycle() {
        //set sessNumber to 1, set sessType to work
        currentSession.sessionNumber = 1;
        currentSession.type = "work";
    }
    
    function resetAll() {
        restartCycle();
        resetTimeLeft();
    }
    
    function increaseSessionNumber() {
        let currS = currentSession.sessionNumber;
        let nextS = (currS + 1);
        let nextSName;
        let sBeforeLong = getNumberOfSessionsBeforeLong();
        
        //if the last session equals the amount of sessions before a long break, initiate long break
        if (currS === sBeforeLong && currentSession.type === "work") { 
            nextSName = "long";
        } else if (currS === (sBeforeLong+1) && currentSession.type === "long") {
            restartCycle();
            return;
        } else if (currS < sBeforeLong && currentSession.type === "work") {
            nextSName = "short";
        } else if (currS < sBeforeLong && currentSession.type === "short") {
            nextSName = "work";
        } else if (currS > sBeforeLong) {
            console.log("Something happened with changing the cycle, while being ahead of the cycle. Or something. So next thing session is a long break, with the current session number reverting back.");
            nextSName = "long";
            nextS = sBeforeLong;
        } else {
            console.log("ERROR: increase session number doesn't know which session is next!");
        }
        
        currentSession.type = nextSName;
        currentSession.sessionNumber = nextS;
    }
    
    return {
        decreaseTimeLeft: decreaseTimeLeft,
        increaseTimeLeft: increaseTimeLeft,
        getTimeLeft: getTimeLeft,
        resetTimeLeft: resetTimeLeft,
        initialDur: currentSession.dur,
        getSpeedMult: getSpeedMult,
        setSpeedMult: setSpeedMult,
        setStartedPlaying: setStartedPlaying,
        setPaused: setPaused,
        setNotStarted: setNotStarted,
        getSessionPlayingProperties: getSessionPlayingProperties,
        convertToMS: convertToMS,
        convertToMinSec: convertToMinSec,
        init: init,
        getCurrentSessionInfo: getCurrentSessionInfo,
        increaseSessionNumber: increaseSessionNumber,
        getIntervalTime: getIntervalTime,
        skipSession: skipSession,
        getCycleLength: getCycleLength,
        setCycleLength: setCycleLength,
        resetAll: resetAll,
        changeDuration: changeDuration,
        getSessionsCurrentDuration: getSessionsCurrentDuration,
        resetAllDurations: resetAllDurations
    };    
    
})();


var stats = (function() {
    //module keeps track of long-term statistics
    
    return {
        
    };
})();


/* OLD CODE

var pomodoro = (function () {

    function getSessionLengths() {
        let arr = [];
        for (var prop in sessions) {
            let inner = [];
            inner.push(sessions[prop].long, sessions[prop].duration.current);
            arr.push(inner);
        }
        return arr;
    }

    function changeSessionLength(session, amount) {
        let cur = sessions[session].duration.current;
        let max = sessions[session].duration.max;
        let min = sessions[session].duration.min;

        console.log(cur + " was the length of " + session);
        cur += amount;
        console.log(cur + " is the new length of " + session);

        sessions[session].duration.current = cur;

        if (cur >= max || cur <= min) {
            return true;
        } else {
            return false;
        }
    }


    function resetTimer() {
        currentSession.session = 0;
        currentSession.cycle = 0;
        buildCurrentSessionData();
        timer.init(currentSession.length);
    }

    function resetDurations() {
        for (var sess in sessions) {
            sessions[sess].duration.current = sessions[sess].duration.initial;
        }
    }
    
*/
