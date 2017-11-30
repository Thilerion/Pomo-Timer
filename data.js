/*jshint devel: true, esversion: 6, browser: true*/
//keeps track of most information

/*
relevant information:
    ispaused/isrunning
    hasinitialised
    hasStarted
    currentSession
    sessionDuration
    
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
    //the session variable contains all information about the different session types, as well as the current session
    var sessions = {};
    
    //creates a prototype from which sessions are made
    function Session(short, long, initialDur, maxDur, minDur) {
        this.short = short;
        this.long = long;
        this.dur = {};
        this.dur.current = this.dur.initial = initialDur;
        this.dur.max = maxDur;
        this.dur.min = minDur;
    }
    
    //adds method to prototype to reset duration to initial duration
    Session.prototype.resetDur = function() {
        this.dur.current = this.dur.initial;
        console.log("Duration of " + this.long + " has been reset to " + this.dur.current);
    };
    
    Session.prototype.increaseDur = function() {
        this.dur.current += 1;
        console.log("Duration of " + this.long + " has been increased by one to " + this.dur.current);
    };
    
    Session.prototype.decreaseDur = function() {
        this.dur.current -= 1;
        console.log("Duration of " + this.long + " has been decreased by one to " + this.dur.current);
    };
    
    //creates the three session types and assigns them to the above "sessions" variable
    sessions.work = new Session("work", "Work", 25, 60, 25);
    sessions.short = new Session("short", "Short Break", 5, 15, 2);
    sessions.long = new Session("long", "Long Break", 20, 60, 5);
    console.log(sessions);
    
    //the timerData variable contains all information about the current timer: whether it is running, paused, started, finished, timerspeed, intervalspeed and more
    //also contains the current time and the remaining time
    var timerData = {};
    
    return {
        
    };
})();

var stats = (function() {
    //module keeps track of long-term statistics
    
    return {
        
    };
})();






/* OLD CODE

var pomodoro = (function () {
    var sessions = {
        work: {
            short: "work",
            long: "Work",
            duration: {
                current: 25,
                max: 60,
                min: 15,
                initial: 25
            }
        },
        sBreak: {
            short: "sBreak",
            long: "Short Break",
            duration: {
                current: 5,
                max: 15,
                min: 2,
                initial: 5
            }
        },
        lBreak: {
            short: "lBreak",
            long: "Long Break",
            duration: {
                current: 20,
                max: 60,
                min: 5,
                initial: 20
            }
        }
    };

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

    return {
        getCurrent: getCurrentSessionInfo,
        getSessionLengths: getSessionLengths,
        finishedTimer: finishedTimer,
        changeLength: changeSessionLength,
        resetTimer: resetTimer,
        resetDurations: resetDurations,
        changeCycle: changeCycle,
        hasStarted: hasStarted
    };

})();

*/
