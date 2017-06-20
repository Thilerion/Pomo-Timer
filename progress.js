var progress = (function() {
  
  var el = document.getElementById("pBar");
  var width = 0;
  
  function updateBar(current, max) {
    width = ((current/max) * 100).toFixed(4);
    
    if (width < 0) {
      width = 0;
    } else if (width > 100) {
      width = 100;
    }
    
    el.style.width = width + "%";    
  }
  
  return {
    updateBar: updateBar
  };
  
})();

/*var current = 0;
var max = 1500;

var intervalTest = setInterval(function() {
  if (current >= max) {
    clearInterval(intervalTest);
  } else if (max - current < 3.4) {
    current = max;
    progress(current, max);
    clearInterval(intervalTest);
  } else {
    current += 3.4;
    progress(current, max);
  }  
}, 10);*/