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
        this.dur.maxLimitReached = false;
        this.dur.min = convertToMS(minDur);
        this.dur.minLimitReached = false;
    }
    
    Session.prototype.maxReached = function(yesOrNo) {
        if (yesOrNo === this.dur.maxLimitReached) {
            return;
        } else {
            this.dur.maxLimitReached = yesOrNo;
            controller.checkDurationDisabled(this.name, this.dur.maxLimitReached, "max");
        }
    };
    
    Session.prototype.minReached = function(yesOrNo) {
        if (yesOrNo === this.dur.minLimitReached) {
            return;
        } else {
            this.dur.minLimitReached = yesOrNo;
            controller.checkDurationDisabled(this.name, this.dur.minLimitReached, "min");
        }
    };
    
    //adds method to prototype to reset duration to initial duration
    Session.prototype.resetDur = function() {
        this.dur.current = this.dur.initial;
        this.maxReached(false);
        this.minReached(false);
        console.log("Duration of " + this.fullName + " has been reset to " + this.dur.current);
    };
    
    Session.prototype.increaseDur = function(amount) {
        if (amount < 60000) {
            amount = 60000;
        }
        
        if (this.dur.current + amount > this.dur.max) {
            console.log("Error! Duration of " + this.fullName + " could not increase beyond maximum.");
        } else {
            this.dur.current += amount;
            console.log("Duration of " + this.fullName + " has been increased by one minute to " + this.dur.current + " ms");
        }
    };
    
    Session.prototype.decreaseDur = function(amount) {
        if (amount > -60000) {
            amount = -60000;
        }
        
        amount = amount * -1;
        
        if (this.dur.current - amount < this.dur.min) {
            console.log("Error! Duration of " + this.fullName + " could not decrease beyond minimum.");
        } else {
            this.dur.current -= amount;
            console.log("Duration of " + this.fullName + " has been decreased by one minute to " + this.dur.current + " ms");
        }
    };
    
    //creates the three session types and assigns them to the above "sessions" variable
    sessions.work = new Session("work", "Work", 25, 60, 15);
    sessions.short = new Session("short", "Short Break", 5, 15, 2);
    sessions.long = new Session("long", "Long Break", 20, 60, 5);
    
    var currentCycle = {
        "currentSessionTotalDur": function() {
            return currentCycle.currentCycleInfo[currentCycle.sessionNumber].currentDur();
        },
        "timeLeft": null, //starting time in ms, maybe change on init...
        "resetTimeLeft": function() {
            currentCycle.timeLeft = currentCycle.currentSessionTotalDur();    
        },
        "increaseTimeLeft": function(n) {
            currentCycle.timeLeft += n;
        },
        "decreaseTimeLeft": function(n) {
            currentCycle.timeLeft -= n;
        },
        "sessionNumber": 0,
        "speedMult": 1,
        "hasStarted": false,
        "isPlaying": false,
        "getSessionPlayingProps": function() {
            return {
                hasStarted: currentCycle.hasStarted,
                isPlaying: currentCycle.isPlaying
            };
        },
        "cycleLength": 3,
        "currentCycleInfo": [],
        "goToNextSession": function() {
            let s = currentCycle.sessionNumber;
            currentCycle.currentCycleInfo[s].setFinished(true);
            if (currentCycle.currentCycleInfo.length == s) {
                generateCurrentCycleInfo();
                currentCycle.sessionNumber = 0;
            } else {
                currentCycle.sessionNumber++;
            }
        },
        "setCurrentStarted": function() {
            let s = currentCycle.sessionNumber;
            currentCycle.currentCycleInfo[s].setStarted(true);
        },
        "setCurrentFinished": function() {
            let s = currentCycle.sessionNumber;
            currentCycle.currentCycleInfo[s].setStarted(true);
        },
        "setCurrentNotStarted": function() {
            let s = currentCycle.sessionNumber;
            currentCycle.currentCycleInfo[s].setStarted(false);
        },
        "getInfoTest": function() {
            return currentCycle.currentCycleInfo;
        },
        "startCurrentSession": function() {
            currentCycle.hasStarted = true;
            currentCycle.isPlaying = true;
            currentCycle.setCurrentStarted();
        }
    };
    
    function CycleSession(type) {
        this.type = type;
        this.started = false;
        this.finished = false;
    }
    
    CycleSession.prototype.fullName = function() {
        return sessions[this.type].fullName;
    }
    
    CycleSession.prototype.currentDur = function() {
        return sessions[this.type].dur.current;
    }
    
    CycleSession.prototype.setStarted = function(bool) {
        this.started = bool;
    }
    
    CycleSession.prototype.setFinished = function(bool) {
        this.finished = bool;
    }
    
    function generateCurrentCycleInfo(cycleLength) {
        let c = [];
        if (cycleLength == undefined) {
            cycleLength = currentCycle.cycleLength;
        }
        for (let i = 0; i < cycleLength; i++) {
            c.push(new CycleSession("work"));
            c.push(new CycleSession("short"));
        }
        c.pop();
        c.push(new CycleSession("long"));
        currentCycle.currentCycleInfo = c;
        console.log(currentCycle.currentCycleInfo);
    }
    
    function finishedSession() {
        setNotStarted();
        //go to next session
        currentCycle.goToNextSession();
        
        currentCycle.resetTimeLeft();
    }
    
    function startedSession() {
        currentCycle.startCurrentSession();
        controller.changeResumePauseButton();
    }
    
    function changeDuration(sess, amountMS) {
        if (amountMS > 0) {
            sessions[sess].increaseDur(amountMS);
        } else if (amountMS < 0) {
            sessions[sess].decreaseDur(amountMS);
        } else {
            console.log("Error! Amount to change duration by was 0???");
        }
        
        isDurationLimitReached(sess);
    }
    
    function isDurationLimitReached(sess) {
        let d = sessions[sess].dur;
        
        if (d.current === d.max && d.maxLimitReached === false) {
            console.log("Max reached!");
            sessions[sess].maxReached(true);
        } else if (d.current < d.max && d.maxLimitReached === true){
            console.log("Duration is no longer at maximum.");
            sessions[sess].maxReached(false);
        }
        if (d.current === d.min && d.minLimitReached === false) {
            console.log("Min reached!");
            sessions[sess].minReached(true);
        } else if (d.current > d.min && d.minLimitReached === true) {
            console.log("Duration is no longer at minimum.");
            sessions[sess].minReached(false);
        }
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
        if (currentCycle.timeLeft - n < 100) {
            currentCycle.timeLeft = 100;
            controller.finishedSession();
        } else {
            currentCycle.decreaseTimeLeft(n);
        }        
    }
    
    function increaseTimeLeft(n) {
        currentCycle.timeLeft += n;
    }
    
    function getTimeLeft() {
        if (currentCycle.timeLeft) {
            return currentCycle.timeLeft;
        } else {
            currentCycle.resetTimeLeft();
            console.log("No session duration initialized! Defaulting to current session init duration.");
            return currentCycle.timeLeft;
        }
    }
    
    function resetTimeLeft() {
        //resets timeLeft according to the duration of the current session
        currentCycle.timeLeft = currentCycle.currentSessionTotalDur();
    }
    
    function skipSession() {
        currentCycle.timeLeft = 3000;
    }
    
    function getSpeedMult() {
        return currentCycle.speedMult;
    }
    
    function setSpeedMult(mult) {
        let updSpeedMult = parseInt(mult);
        currentCycle.speedMult = parseInt(Math.floor(updSpeedMult));
        console.log("New speed multiplier is: " + currentCycle.speedMult);
    }
    
    //divides 1000ms with speedmult to get how long the interval time should be to get accurate numbers in the view
    function getIntervalTime() {
        let s = currentCycle.speedMult;
        let i = 1000 / currentCycle.speedMult;
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
    
    function setPaused() {
        currentCycle.hasStarted = true;
        currentCycle.isPlaying = false;
        controller.changeResumePauseButton();
    }
    
    function setNotStarted() {
        currentCycle.hasStarted = false;
        currentCycle.isPlaying = false;
        controller.changeResumePauseButton();
    }
    
    function init(startingTime) {
        //for testing purposes, allows changing initial time on window load (controller)
        generateCurrentCycleInfo();
        currentCycle.timeLeft = startingTime;
    }
    
    function getCycleLength() {
        return currentCycle.cycleLength;
    }
    
    function setCycleLength(n) {
        currentCycle.cycleLength = n;
    } 
    
    function restartCycle() {
        //set sessNumber to 1, set sessType to work
        generateCurrentCycleInfo();
        currentCycle.sessionNumber = 0;
    }
    
    function resetAll() {
        restartCycle();
        resetTimeLeft();
    }
    
    return {
        init: init,
        getTimeLeft: getTimeLeft,
        convertToMinSec: convertToMinSec,
        convertToMS: convertToMS,
        getSessionsCurrentDuration: getSessionsCurrentDuration,
        getIntervalTime: getIntervalTime,
        startCurrentSession: currentCycle.startCurrentSession,
        setPaused: setPaused,
        setNotStarted: setNotStarted,
        getSpeedMult: getSpeedMult,
        setSpeedMult: setSpeedMult,
        decreaseTimeLeft: decreaseTimeLeft,
        getSessionPlayingProperties: currentCycle.getSessionPlayingProps,
        changeDuration: changeDuration,
        resetAllDurations: resetAllDurations,
        getCycleLength: getCycleLength,
        setCycleLength: setCycleLength,
        skipSession: skipSession,
        finishedSession: finishedSession,
        resetTimeLeft: resetTimeLeft,
        resetAll: resetAll,
        totalSessions: currentCycle.totalSessions,
        generateCurrentCycleInfo: generateCurrentCycleInfo,
        c: currentCycle.getInfoTest
    };    
    
})();


var stats = (function() {
    //module keeps track of long-term statistics
    
    return {
        
    };
})();