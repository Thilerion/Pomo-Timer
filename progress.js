function progress(current, max) {
  //current progress in s, finish duration in s
  
  var el = document.getElementById("pBar");
  var steps = 200;
  
  var width = ((current / max) * 100).toFixed(1);
  
  el.style.width = width + "%";
}

var current = 0;
var max = 1500;

var intervalTest = setInterval(function() {
  progress(current, max);
  current++;
}, 100);