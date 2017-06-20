var progress = (function () {

  var el = document.getElementById("pBar");
  var width = 0;

  function updateBar(current, max) {
    width = ((current / max) * 100).toFixed(4);
    
    if (width < 0) {
      width = 0;
    } else if (width > 99.9) {
      width = 100;
    }
    
    el.style.width = width + "%";
  }

  function progressTransition(speed) {
    el.style.transition = "width " + speed + "s";
  } 

  return {
    updateBar: updateBar,
    progressTransition: progressTransition
  };

})();
