/*jshint devel: true, esversion: 6, browser: true*/

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
    //module keeps track of information
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
        console.log("Duration of " + this.long + " has been reset to " + this.dur.current);
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
        "hasStarted": false,
        "isPaused": false,
        "isPlaying": false,
        //checks to see what the initial duration is
        "dur": function() {
            let sess = currentSession.type;
            return sessions[sess].dur.current;
        },
        "timeLeft": 1500000, //25 minutes in milliseconds, maybe change on init...
        "speed": 1000
    };
    
    var cycleData = {
        //Placeholder: return next session type
        "sessionNumber": 1,
        "nextSession": function() {
            let next;
            if (currentSession.type === "work" && this.sessionNumber > 5) {
                next = "long";
                this.sessionNumber = 1;
            } else if (currentSession.type === "work") {
                next = "short";
            } else if (currentSession.type === "short") {
                next = "work";
            }
        }
        
        /* THIS IS ALL FOR THE FUTURE, NOW FOCUS ON JUST LETTING THE TIMER RUN!!
        //data for the cycle, with standard cycle being 3x work and short break, then long break
        "amount": 3,
        //needs to be updated at the end of every session
        "sessionNumber": 1,
        "nextSessionType": function() {
            let n = cycleData.sessionNumber;
            let max = cycleData.amount * 2;
            //NOT FINISHED, depends on who requests this method to be run
            //important to keep in mind if sessionNumber is increased first, or if nextSessionType is requested first
        } */
    };
    
    function convertToMS(min) {
        return min * 60000;
    }
    
    function decreaseTimeLeft(n) {
        currentSession.timeLeft -= n;
    }
    
    function increaseTimeLeft(n) {
        currentSession.timeLeft += n;
    }
    
    function getTimeLeft() {
        return currentSession.timeLeft;
    }
    
    function resetTimeLeft() {
        //resets timeLeft according to the duration of the current session
        currentSession.timeLeft = currentSession.dur();
    }
    
    function getSpeed() {
        return currentSession.speed;
    }
    
    function setSessionPlayingProperties(started, paused, playing) {
        currentSession.hasStarted = started;
        currentSession.isPaused = paused;
        currentSession.isPlaying = playing;
        console.log("Set properties to (started, paused, playing): " + currentSession.hasStarted + " " + currentSession.isPaused + " " + currentSession.isPlaying);
        controller.changeResumePauseButton();
    }
    
    function getSessionPlayingProperties() {
        return [currentSession.hasStarted, currentSession.isPaused, currentSession.isPlaying];
    }
    
    return {
        decreaseTimeLeft: decreaseTimeLeft,
        increaseTimeLeft: increaseTimeLeft,
        getTimeLeft: getTimeLeft,
        resetTimeLeft: resetTimeLeft,
        initialDur: currentSession.dur,
        getSpeed: getSpeed,
        setSessionPlayingProperties: setSessionPlayingProperties,
        getSessionPlayingProperties: getSessionPlayingProperties
    };
    
    
    
    
    
})();





var stats = (function() {
    //module keeps track of long-term statistics
    
    return {
        
    };
})();



/* OLD CODE

var pomodoro = (function () {
    var cycle = ["work", "sBreak", "work", "sBreak", "work", "lBreak"];

    var currentSession = {
        session: 0,
        name: "work",
        longName: "Work",
        length: 25,
        cycle: 0
    };

    var hasStarted = false;

    function getCurrentSessionInfo() {
        return currentSession;
    }

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

    function finishedTimer() {
        nextTimer();
        timer.init(currentSession.length);
    }

    function nextTimer() {
        var end = (currentSession.session + 1 >= cycle.length) ? true : false;

        if (end) {
            currentSession.session = 0;
            currentSession.cycle++;
        } else {
            currentSession.session++;
        }

        buildCurrentSessionData();
    }

    function buildCurrentSessionData() {
        currentSession.name = cycle[currentSession.session];
        currentSession.longName = sessions[currentSession.name].long;
        currentSession.length = sessions[currentSession.name].duration.current;
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

    function changeCycle(repeats) {
        //min 2, max 10
        console.log(cycle);
        if (repeats > 1 && repeats < 11) {
            cycle = [];
            for (var i = 0; i < repeats; i++) {
                cycle.push("work", "sBreak");
            }
            cycle[cycle.length - 1] = "lBreak";
        } else {
            cycle = ["work", "sBreak", "work", "sBreak", "work", "lBreak"];
        }
        console.log(cycle);
    }
    
*/
