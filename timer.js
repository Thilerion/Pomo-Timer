/*jshint devel: true, esversion: 6, browser: true*/
/* globals data, controller */

var timer = (function() {
    //module contains the timer
    var _currentTick, _previousTick, _interval, _tickDelta, _intTime;
    
    function start() {
        _previousTick = Date.now();
        
        _intTime = data.getIntervalTime();
        
        console.log("Starting interval with interval: " + _intTime + ", timeLeft: " + data.getTimeLeft());
        
        _interval = setInterval(tick, _intTime);
    }
    
    function pause() {
        clearInterval(_interval);
    }
    
    function resume() {
        data.decreaseTimeLeft(1000);
        //now for some debugging: decreaseTimeLeft pauses the timer if decreasing it means the timer is finished. In that case, this function should not start the timer again
        let timerHasFinished = !data.getPlayingProps().started;
        if (timerHasFinished === false) {
            start();
        }
    }
    
    function tick() {
        _currentTick = Date.now();
        _tickDelta = _currentTick - _previousTick;
        //multiply tick delta with speed multiplier
        _tickDelta *= data.getSpeedMult();
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