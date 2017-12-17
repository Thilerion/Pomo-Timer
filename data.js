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
        sound: false,
        intervalTime: 1000,
        timerStarted: false,
        timerPlaying: false,
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
        getTimerStarted() {
            return timerData.timerStarted;
        },
        getTimerPlaying() {
            return timerData.timerPlaying;
        },
        setTimerStarted(bool) {
            timerData.timerStarted = bool;
        },
        setTimerPlaying(bool) {
            timerData.timerPlaying = bool;
        },
        getCycleLength() {
            return timerData.cycle.length;
        },
        setCycleLength(n) {
            timerData.cycle.length = n;
            timerData.generateCycleFromLength();
        },
        getCycleInfo() {
            return [timerData.cycle.sessions, timerData.cycle.length];  
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
            timerData.cycle.sessions[c].timeline.sessionFinished = bool;
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        },
        setCurrentSessionRunning(bool) {
            let c = timerData.current;
            timerData.cycle.sessions[c].timeline.sessionRunning = bool;
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        },
        setCurrentSessionStarted(bool) {
            let c = timerData.current;
            timerData.cycle.sessions[c].timeline.sessionStarted = bool;
            timerData.cycle.sessions[c].setInitialDur();
            console.log("The cycle now looks like:");
            console.log(timerData.cycle.sessions);
        }
    };
    
    //prototype from which the cycle>session array is made
    function CycleItem(type, typeNumber) {
        this.name = type;
        this.typeNumber = typeNumber;
        this.initialDur = null;
        this.timeline = {
            circleType: "",
            sessionRunning: false,
            sessionFinished: false,
            sessionStarted: false
        };
        
        if (type === "work") {
            this.timeline.circleType = null;
        } else if (type === "short") {
            this.timeline.circleType = "small";
        } else if (type === "long") {
            this.timeline.circleType = "end";
        }
    }
    
    CycleItem.prototype.setInitialDur = function() {
        //sets an initial duration when a certain session starts
        //because when durations are changed in the view, the current session max duration should not
        let n = this.name;
        this.initialDur = sessionTypes[this.name].dur.current;
        console.log("Session initial duration set at: " + this.initialDur);
    };
    
    CycleItem.prototype.getSessionPercentage = function() {
        if (this.name !== "work") {
            return;
        }
        
        let ret = 0;
        
        if (this.timeline.sessionStarted === false) {
            ret = 0;
        } else if (this.timeline.sessionFinished === true) {
            ret = 1;
        } else {
            let tot = convertToMS(this.initialDur);
            let tLeft = timerData.getTimeLeft();
            let tPast = tot - tLeft;
            
            ret = (Math.floor((tPast / tot)*100))/100;
        }
        
        console.log(ret);
        return ret;
    };
    
    //timeline functions
    function getAllSessionPercentages() {
        let arr = [];
        timerData.cycle.sessions.forEach(function(s, i) {
            if (s.name === "work") {
                let obj = {};
                obj.type = s.name;
                obj.num = s.typeNumber;
                obj.percentage = s.getSessionPercentage();
                arr.push(obj);
            }
        });
        return arr;
    }
    
    function getCircleStatuses() {
        //circle 0: always active, finished when session 0 has started
        //circle small: active when running, finished when fnished
        //circle last: active when running, finished when finished
        let obj = {};
                
        obj.start = {};
        obj.start.n = 0;
        obj.start.running = true;
        //first circle is "finished" when the timer has been started at least once
        obj.start.finished = timerData.cycle.sessions[0].timeline.sessionStarted;
        
        obj.small = [];
        
        obj.last = {};
        
        timerData.cycle.sessions.forEach(function(s, i) {
            if (s.name === "short") {
                let shortObj = {};
                shortObj.n = s.typeNumber - 1;
                shortObj.running = s.timeline.sessionStarted;
                shortObj.finished = s.timeline.sessionFinished;
                obj.small.push(shortObj);
            } else if (s.name === "long") {
                obj.last.running = s.timeline.sessionStarted;
                obj.last.finished = s.timeline.sessionFinished;
            }
        });
        
        obj.circleAmount = 2 + obj.small.length;
        obj.last.n = obj.circleAmount - 1;
        console.log(obj);
        return obj;
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
        //runs one time, when all modules are loaded, from controller
        init: init,
        //when a session is started from 0 time passed, from controller
        start: function() {
            timerData.setTimerStarted(true);
            timerData.setTimerPlaying(true);
            timerData.setCurrentSessionStarted(true);
            timerData.setCurrentSessionRunning(true);
        },
        //when a session is resumed, when some time has already passed, from controller
        resume: function() {
            timerData.setTimerStarted(true);
            timerData.setTimerPlaying(true);
            timerData.setCurrentSessionRunning(true);
        },
        //when a session is paused, when timer has already started, from controller
        pause: function() {
            timerData.setTimerPlaying(false);
            timerData.setCurrentSessionRunning(false);
        },
        //when a session is finished, the decreaseTimeLeft function passes this to the control and the controller activates this function
        //set timer to not playing and not started, current session to finished and not running, and go to the next session
        finish: function() {
            timerData.setTimerStarted(false);
            timerData.setTimerPlaying(false);
            timerData.setCurrentSessionFinished(true);
            timerData.setCurrentSessionRunning(false);
            timerData.goToNextSession();
            timerData.resetTimeLeft();
        },
        //when the entire timer is reset, a new cycle is generated and the timer is set to not playing and not started, from controller
        resetAll: function() {
            timerData.restartCycle();
            timerData.resetTimeLeft();
            timerData.setTimerStarted(false);
            timerData.setTimerPlaying(false);
        },
        //when a single session is reset, the timer is not playing and not running, and the current session is not started and not running, from controller
        resetSession: function() {
            timerData.resetTimeLeft();
            timerData.setCurrentSessionStarted(false);
            timerData.setCurrentSessionRunning(false);
            timerData.setCurrentSessionFinished(false);
            timerData.setTimerStarted(false);
            timerData.setTimerPlaying(false);
        },
        //changes duration of a sessionType, from controller
        changeDuration: function(sess, amount) {
            if (amount > 0) {
                sessionTypes[sess].increaseDur(amount);
            } else if (amount < 0) {
                sessionTypes[sess].decreaseDur(amount*-1);
            }
        },
        //when a session is "skipped", timeLeft is set to 3 seconds, from controller
        skipSession: function() {
            timerData.timeLeft = 3000;
        },
        //the eventhandler sends whether sound should be turned on or off to the controller, activating this function
        toggleSound: function(soundOn) {
            timerData.sound = soundOn;
        },
        //the controller requests the status of sound, muted or not
        getSoundStatus: function() {
            return timerData.sound;
        },
        //returns whether the timer has started the session, from timer and controller (button)
        getTimerStarted: timerData.getTimerStarted,
        //returns whether the timer is currently playing, from controller (button and shouldPause?)
        getTimerPlaying: timerData.getTimerPlaying,        
        //used by controller to set a new cyclelength
        setCycleLength: timerData.setCycleLength,
        //////only used by controller to show current length as default for when new length can be chosen
        getCycleLength: timerData.getCycleLength,
        //////only used for controller getting the time to send to the view, and is converted to min and secs first
        getTimeLeft: timerData.getTimeLeft,
        //////not used by other modules
        convertToMS: convertToMS,
        //////not used by other modules except controller for converting the getTimeLeft
        convertToMinSec: convertToMinSec,
        //used by controller to update a single session duration view, and all session duration views
        getAllCurrentDurations: sessionTypes.getAllCurrentDurations,        
        //used when a button is pressed to reset all durations, from controller
        resetAllDurations: sessionTypes.resetAllDurations,
        //used by timer.js to know the interval time
        getIntervalTime: timerData.getIntervalTime,
        //timer wants to know the speedMult, and controller to show as default when changing
        getSpeedMult: timerData.getSpeedMult,
        //by controller to change the speed multiplier
        setSpeedMult: timerData.setSpeedMult,
        //decrease time left, done by timer.js
        decreaseTimeLeft: timerData.decreaseTimeLeft,
        //////by controller, only needs length, to init a new timeline. also by controller to update circle states (needs name, finished, running)
        getCycleInfo: timerData.getCycleInfo,
        //gets all session percentages from all work sessions in the cycle
        getAllSessionPercentages: getAllSessionPercentages,
        //gets all circle statuses and amounts
        getCircleStatuses: getCircleStatuses
    };
})();

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