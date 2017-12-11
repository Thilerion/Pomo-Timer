/*jshint devel: true, esversion: 6, browser: true*/
var timeline = (function () {
    //get list of sessions
    //check how many work sessions (nWork)
    //place first circle after 100/nWork
    //place every next circle after (n * (100/nWork))
    let nWork = null;
    
    let htmlCircleTemplate = ['<div class="circle circle-small circle','" style="left: ','%"></div>'];
    
    let parentDiv = document.querySelector(".timeline-inner-circles-container");    
    
    function createHtmlCircle(n, percent) {
        let circle = htmlCircleTemplate[0] + n + htmlCircleTemplate[1] + percent + htmlCircleTemplate[2];
        placeCircle(circle);
    }
    
    function placeCircle(c) {
        let div = document.createElement("div");
        div.innerHTML = c;
        parentDiv.appendChild(div);
    }
    
    function resetTimeline() {
        let smallCircles = document.querySelectorAll(".circle-small");
                
        smallCircles.forEach(function(el) {
            console.log(el);
            el.remove();
        });
    }
    
    function createCircles(amount) {
        if (nWork === null) {
            nWork = amount;
        } else if (nWork === amount) {
            return;
        } else {
            resetTimeline();
            nWork = amount;
        }
            
        for (let i=1;i<nWork;i++) {
            let percentage = i*(100/nWork);
            console.log("Circle " + i + " with percentage " + percentage);
            createHtmlCircle(i, percentage);
        }
    }    
    
    return {
        createCircles: createCircles,
        resetTimeline: resetTimeline
    };
})();