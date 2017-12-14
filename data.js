/*jshint devel: true, esversion: 6, browser: true*/
/* globals controller */

var data = (function() {
    //session variable contains all information about the session types
    var sessionTypes = {
        resetAllDurations() {
            sessionTypes.work.resetDur();
            sessionTypes.long.resetDur();
            sessionTypes.short.resetDur();
        },
        getAllCurrentDurations() {
            return {
                work: sessionTypes.work.dur.current,
                short: sessionTypes.short.dur.current,
                long: sessionTypes.long.dur.current
            };
        }
    };
    
    //creates a prototype from which session types are made
    function Session(name, fullName, initialDur, maxDur, minDur) {
        this.name = name;
        this.fullName = fullName;
        this.dur = {
            current: initialDur,
            initial: initialDur,
            max: maxDur,
            min: minDur,
            //if the increase and decrease buttons should be/are disabled
            buttonsDisabled: {
                increase: false,
                decrease: false
            }
        };
    }
    
    //prototype method to reset the duration of a method
    Session.prototype.resetDur = function() {
        this.dur.current = this.dur.initial;
        this.changeButtonState();
    };
    
    //prototype methods to change disabling of buttons (if there is a change)
    Session.prototype.changeButtonState = function() {
        let iBut = this.dur.buttonsDisabled.increase;
        let dBut = this.dur.buttonsDisabled.decrease;
        
        let maxReached = this.dur.current >= this.dur.max ? true : false;
        let minReached = this.dur.current <= this.dur.min ? true : false;
        
        console.log(maxReached, minReached);
        console.log(iBut, dBut);
        
        //TODO: send signal to controller/view
        if (maxReached === true && iBut === false) {
            controller.checkDurationDisabled(this.name, true, "max");
        } else if (maxReached === false && iBut === true) {
            controller.checkDurationDisabled(this.name, false, "max");
        }
        
        if (minReached === true && dBut === false) {
            controller.checkDurationDisabled(this.name, true, "min");
        } else if (minReached === false && dBut === true) {
            controller.checkDurationDisabled(this.name, false, "min");
        }
        
        this.dur.buttonsDisabled.increase = maxReached;
        this.dur.buttonsDisabled.decrease = minReached;
    };
    
    //prototype methods to change current duration
    Session.prototype.increaseDur = function(minutes) {
        if (this.dur.current + minutes < this.dur.max) {
            this.dur.current += minutes;
        } else if (this.dur.current + minutes === this.dur.max) {
            this.dur.current += minutes;
        } else {
            return false;
        }
        this.changeButtonState();
    };
    
    Session.prototype.decreaseDur = function(minutes) {
        if (this.dur.current - minutes > this.dur.min) {
            this.dur.current -= minutes;
        } else if (this.dur.current - minutes === this.dur.min) {
            this.dur.current -= minutes;
        } else {
            return false;
        }
        this.changeButtonState();
    };
    
    //timerData variable holds all the other data needed, such as cycleArray, current session number, and time left
    var timerData = {
        timeLeft: null,
        current: 0,
        speedMult: 1,
        intervalTime: 1000,
        started: false,
        playing: false,
        cycle: {
            length: 3,
            sessions: [],
            get totalSessions() {
                if (timerData.cycle.length*2 === timerData.cycle.sessions.length) {
                    return timerData.cycle.length * 2;
                } else {
                    console.log("Error! Length of cycle, and the amount of sessions in the sessions array do not match up!");
                    return undefined;
                }                
            }
        },
        getTimeLeft() {
            return timerData.timeLeft;
        },
        setTimeLeft(ms) {
            timerData.timeLeft = ms;
        },
        resetTimeLeft() {
            let curDur = timerData.getCurrentSessionDur().current;
            let curDurMS = convertToMS(curDur);
            timerData.setTimeLeft(curDurMS);
        },
        decreaseTimeLeft(ms) {
            if (timerData.timeLeft - ms < 200) {
                timerData.timeLeft = 0;
                controller.finishedSession();
            } else {
                timerData.timeLeft -= ms;
            }
        },
        getSpeedMult() {
            return timerData.speedMult;
        },
        setSpeedMult(mult) {
            timerData.speedMult = parseInt(Math.floor(mult));
            timerData.setIntervalTime();
        },
        getIntervalTime() {
            return timerData.intervalTime;
        },
        setIntervalTime() {
            let s = timerData.getSpeedMult();
            let interval = Math.floor(1000 / s);
            //checking for min 40 or max 1000
            if (interval < 40) {
                interval = 40;
            } else if (interval > 1000) {
                interval = 1000;
            }
            timerData.intervalTime = interval;
        },
        getPlayingProps() {
            console.log("Started: " + timerData.started, "Playing: " + timerData.playing);
            return {
                started: timerData.started,
                playing: timerData.playing
            };
        },
        setPlayingProps(s,p) {
            if (s !== null) {
                timerData.started = s;
            }
            if (p !== null) {
                timerData.playing = p;
            }
        },
        getCycleLength() {
            return timerData.cycle.length;
        },
        setCycleLength(n) {
            timerData.cycle.length = n;
            timerData.generateCycleFromLength();
        },
        generateCycleFromLength() {
            let s = ["work", "short", "long"];
            let l = timerData.getCycleLength();
            let long = l - 1;
            let arr = [];
            
            let nWork = 1;
            let nShort = 1;
            let nLong = 1;
            
            //for amount of cycles, add work and break (short, or last being long)
            for (let i = 0; i < l; i++) {
                arr.push(new CycleItem(s[0], nWork));
                nWork++;
                if (i === long) {
                    arr.push(new CycleItem(s[2], nLong));
                    nLong++;
                } else {
                    arr.push(new CycleItem(s[1], nShort));
                    nShort++;
                }
            }
            nWork = 1;
            nShort = 1;
            nLong = 1;
            timerData.cycle.sessions = arr;
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        },
        goToNextSession() {
            let total = timerData.cycle.totalSessions - 1;
            let current = timerData.current;
            console.log(total, current);
            if (current < total) {
                timerData.current++;
            } else if (current >= total) {
                timerData.restartCycle();
            }
        },
        restartCycle() {
            timerData.current = 0;
            timerData.generateCycleFromLength();
        },
        getCurrentSessionName() {
            let c = timerData.current;
            return timerData.cycle.sessions[c].name;
        },
        getCurrentSessionDur() {
            let n = timerData.getCurrentSessionName();
            return sessionTypes[n].dur;
        },
        setCurrentSessionFinished(bool) {
            let c = timerData.current;
            timerData.cycle.sessions[c].timeline.circleFinished = bool;
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        },
        setCurrentSessionStarted(bool) {
            let c = timerData.current;
            timerData.cycle.sessions[c].timeline.circleRunning = bool;
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        }
    };
    
    //prototype from which the cycle>session array is made
    function CycleItem(type, typeNumber) {
        this.name = type;
        this.typeNumber = typeNumber;
        this.timeline = {
            circleType: "",
            circleRunning: false,
            circleFinished: false
        };
        
        if (type === "work") {
            this.timeline.circleType = null;
        } else if (type === "short") {
            this.timeline.circleType = "small";
        } else if (type === "long") {
            this.timeline.circleType = "end";
        }
    }
    
    //init function, only to be used when all modules are loaded
    function init() {
        sessionTypes.work = new Session("work", "Work", 25, 60, 15);
        sessionTypes.short = new Session("short", "Short Break", 5, 15, 2);
        sessionTypes.long = new Session("long", "Long Break", 20, 60, 5);
        
        timerData.setCycleLength(3);
        
        timerData.resetTimeLeft();
    }
    
    //time conversion functions
    function convertToMS(minutes) {
        return minutes * 60000;
    }
    
    function convertToMinSec(ms) {
        return {
            min: Math.floor(Math.round(ms / 1000) / 60 % 60),
            sec: Math.floor(Math.round(ms / 1000) % 60)
        };
    }   
    
    return {
        //controller
        init: init,
        start: function() {
            timerData.setPlayingProps(true, true);
            timerData.setCurrentSessionStarted(true);
        },
        pause: function() {
            timerData.setPlayingProps(null, false);
        },
        finish: function() {
            timerData.setPlayingProps(false, false);
            timerData.setCurrentSessionFinished(true);
            timerData.goToNextSession();
            timerData.resetTimeLeft();
        },
        getPlayingProps: timerData.getPlayingProps,
        getTimeLeft: timerData.getTimeLeft,
        convertToMS: convertToMS,
        convertToMinSec: convertToMinSec,
        getCycleLength: timerData.getCycleLength,
        getAllCurrentDurations: sessionTypes.getAllCurrentDurations,
        changeDuration: function(sess, amount) {
            if (amount > 0) {
                sessionTypes[sess].increaseDur(amount);
            } else if (amount < 0) {
                sessionTypes[sess].decreaseDur(amount*-1);
            }
        },
        resetAllDurations: sessionTypes.resetAllDurations,
        getIntervalTime: timerData.getIntervalTime,
        getSpeedMult: timerData.getSpeedMult,
        decreaseTimeLeft: timerData.decreaseTimeLeft,
        resetAll: function() {
            timerData.restartCycle();
            timerData.resetTimeLeft();
            timerData.setPlayingProps(false, false);
        },
        resetSession: function() {
            timerData.resetTimeLeft();
            timerData.setCurrentSessionStarted(false);
            timerData.setPlayingProps(false, false);
        },
        getCurrentSessionInfo: function() {
            return {
                n: timerData.current,
                s: timerData.cycle.sessions[timerData.current]
            };
        },
        skipSession: function() {
            timerData.timeLeft = 3000;
        }
    };
})();

/*
var dataLegacy = (function() {
    
    
    var currentCycle = {
        
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
    };
    
    CycleSession.prototype.currentDur = function() {
        return sessions[this.type].dur.current;
    };
    
    CycleSession.prototype.setStarted = function(bool) {
        this.started = bool;
    };
    
    CycleSession.prototype.setFinished = function(bool) {
        this.finished = bool;
    };
    
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
    

    
    function getSessionsCurrentDuration() {
        let ret = {};
        for (const s in sessions) {
            ret[s] = sessions[s].dur.current;
        }
        console.log(ret);
        return ret;
    }
    


    
    function resetTimeLeft() {
        //resets timeLeft according to the duration of the current session
        currentCycle.timeLeft = currentCycle.currentSessionTotalDur();
    }
    
    function skipSession() {
        currentCycle.timeLeft = 3000;
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
    
})();

*/


/*
but also long-term information:
    totalTimePlayed
    totalSessions
    amountOfPauses
    timeWorked
    timePaused
    etc etc
*/


var stats = (function() {
    //module keeps track of long-term statistics
    
    return {
        
    };
})();