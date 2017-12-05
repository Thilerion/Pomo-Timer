/*jshint devel: true, esversion: 6, browser: true*/
/* globals data, controller */
//controls the timer, and sends relevant information to the controller

/*
relevant information:
    current time
*/

var timer = (function() {
    //module contains the timer
    var _currentTick, _previousTick, _interval, _tickDelta;
    
    function start() {
        _previousTick = Date.now();
        
        let _speed = data.getSpeed();
        
        console.log("Starting interval with speed: " + _speed + ", timeLeft: " + data.getTimeLeft());
        
        _interval = setInterval(tick, _speed);
    }
    
    function pause() {
        clearInterval(_interval);
        //set paused and not playing and has started etc
    }
    
    function resume() {
        data.decreaseTimeLeft(1000);
        start();
    }
    
    function tick() {
        _currentTick = Date.now();
        _tickDelta = _currentTick - _previousTick;
        data.decreaseTimeLeft(_tickDelta);
        _previousTick = _currentTick;
        controller.timerTick();
    }
    
    return {
        start: start,
        pause: pause,
        resume: resume
    };
})();






/* OLD CODE

var timer = (function () {

    var startTime, timeLeft, endTime, interval;
    var _running = false;
    var _started = false;

    var _speed = 1;
    var _intervalSpeed = 1000;

    function getTimeLeft() {
        return [Math.floor(Math.round(timeLeft / 1000) / 60 % 60), Math.floor(Math.round(timeLeft / 1000) % 60)];
    }

    function startTimer() {
        pomodoro.hasStarted = true;

        //decrease time left by 1 second to reduce delay after clicking button
        if (timeLeft > 1000) {
            timeLeft -= 1000;
        } else {
            timeLeft = 0;
            finishedTimer();
        }

        //the end time of the current timer is the amount of time left + the start time
        endTime = Date.now() + timeLeft;

        progress.setTransitionTiming(0);
        changeMode(true, true);

        //initialize setInterval on the timer-scoped interval variable
        interval = setInterval(tick, _intervalSpeed);
    }

    function tick() {
        //called by the timer-scoped interval variable every 1000ms

        if (timeLeft - 1000 < 50) {
            timeLeft = 0;
            finishedTimer();
        } else if (_speed > 1) {
            timeLeft -= 1000;
        } else {
            timeLeft = endTime - Date.now();
        }

        //for debugging
        console.log(timeLeft, getTimeLeft()[0], getTimeLeft()[1]);
    }

    function resetSession() {
        clearInterval(interval);
        timeLeft = startTime;
        changeMode(false, false);
    }

    function pauseTimer() {
        clearInterval(interval);
        changeMode(true, false);
    }

    function finishedTimer() {
        progress.setTransitionTiming(1);
        clearInterval(interval);
        pomodoro.finishedTimer();
    }

    function initTimer(minutes) {
        startTime = minutes * 60000;
        timeLeft = startTime;

        changeMode(false, false);

        //for debugging
        console.log(timeLeft + " milliseconds left, " + startTime + " milliseconds as start time.");
    }

    function skipToEndDEBUG() {
        pauseTimer();
        timeLeft = 5000;
        startTimer();
    }

    function changeSpeedDEBUG(inp) {
        progress.setSpeed(inp);
        pauseTimer();

        if (inp >= 1 && inp <= 50) {
            _speed = inp;
            _intervalSpeed = 1000 / inp;
        }
        startTimer();
    }

    function changeMode(started, running) {
        _started = started;
        _running = running;

        //for debugging
        console.log("Is running: " + _running, "Is started: " + _started);
    }

    function getMode() {
        var obj = {};
        obj.started = _started;
        obj.running = _running;

        //for debugging
        console.log(obj);

        return obj;
    }

    return {
        reset: resetSession,
        pause: pauseTimer,
        start: startTimer,
        init: initTimer,
        getTime: getTimeLeft,
        changeMode: changeMode,
        getMode: getMode,
        debugSkip: skipToEndDEBUG,
        changeSpeed: changeSpeedDEBUG
    };

})();

*/