var progress = (function () {

  var el = document.getElementById("pBar");
  var width = 0;

  function updateBar(current, max) {
    width = ((current / max) * 100).toFixed(4);
    
    if (width < 0) {
      width = 0;
    } else if (max - current <= 1) {
      width = 100;
    }
    
    el.style.width = width + "%";
  }

  return {
    updateBar: updateBar,
  };

})();


/*
Todo:
  set transition speed (for debug mode when speed is faster)
  set transition type (ease when new timer, linear when ticking)
  
Maybe:
  way to change color depending on time-background color
*/
