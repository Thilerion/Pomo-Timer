var progress = (function () {

  var el = document.getElementById("pBar");
  
  var _width = 0;
  var _speed = 0.95;
  var _transition = "linear";

  function updateBar(current, max) {
    var width = ((current / max) * 100).toFixed(4);
    
    if (width < 0) {
      width = 0;
    } else if (max - current <= 1) {
      width = 100;
    }
    
    _width = width;
    
    _updateTransition();
  }
  
  function setSpeed(speed) {
    //speed is the amount of ticks per second
    //transition speed should be the length of a tick -5%
    var tSpeed = 1 / speed;
    var fivePercent = tSpeed * 0.05;
    
    _speed = tSpeed - fivePercent;
    
    _updateTransition();
  }
  
  function setTransitionTiming(fn) {
    //can be either 0 for linear of 1 for ease
    if (fn === 0) {
      _transition = "linear";
    } else if (fn === 1) {
      _transition = "ease";
    } else {
      _transition = "linear";
    }
    
    _updateTransition();    
  }
  
  function _updateTransition() {
    var el = document.getElementById("pBar");
    
    el.style.transitionProperty = "width";
    el.style.transitionDuration = "" + _speed + "s";
    el.style.transitionTimingFunction = _transition;
  }

  return {
    updateBar: updateBar,
    setSpeed: setSpeed,
    setTransitionTiming: setTransitionTiming
  };

})();


/*
Todo:
  set transition speed (for debug mode when speed is faster)
  set transition type (ease when new timer, linear when ticking)
  
Maybe:
  way to change color depending on time-background color
*/
