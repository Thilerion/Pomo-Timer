/*jshint devel: true, esversion: 6, browser: true*/
var timeline = (function () {
    //get list of sessions
    //check how many work sessions (nWork)
    //place first circle after 100/nWork
    //place every next circle after (n * (100/nWork))
    
    let nWork = 3;
    let nSmallCircles = nWork - 1;
    let htmlCircleTemplate = ['<div class="circle circle-small circle','" style="left: ','%"></div>'];
    
    let lastCircle = document.querySelector(".circle-end");
    let parentDiv = document.querySelector(".timeline-line");    
    
    function createHtmlCircle(n, percent) {
        let circle = htmlCircleTemplate[0] + n + htmlCircleTemplate[1] + percent + htmlCircleTemplate[2];
        placeCircle(circle);
    }
    
    function placeCircle(c) {
        let div = document.createElement("div");
        div.innerHTML = c;
        parentDiv.insertBefore(div, lastCircle);
    }
    
    
    return {
        createHtmlCircle: createHtmlCircle,
        placeCircle: placeCircle
    };
})();