/*jshint devel: true, esversion: 6, browser: true*/
var timeline = (function () {
    //get list of sessions
    //check how many work sessions (nWork)
    //place first circle after 100/nWork
    //place every next circle after (n * (100/nWork))
    let nWork = null;
    
    let htmlCircleTemplate = ['<div class="circle circle-small circle','" style="left: ','%"></div>'];
    
    let parentDiv = document.querySelector(".timeline-inner-circles-container");
    
    let circles = [];
    
    function createHtmlCircle(n, percent) {
        let circle = htmlCircleTemplate[0] + n + htmlCircleTemplate[1] + percent + htmlCircleTemplate[2];
        placeCircle(circle);
    }
    
    function placeCircle(c) {
        let div = document.createElement("div");
        div.innerHTML = c;
        parentDiv.appendChild(div);
        circles.push(div.firstChild);
    }
    
    function resetTimeline() {
        let smallCircles = document.querySelectorAll(".circle-small");
                
        smallCircles.forEach(function(el) {
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
            
        circles = [];
        for (let i=1;i<nWork;i++) {
            let percentage = i*(100/nWork);
            console.log("Circle " + i + " with percentage " + percentage);
            createHtmlCircle(i, percentage);
        }
        circles.push(document.querySelector(".circle-end"));
        console.log(circles);
    }

    function updateActiveCircles(props, sessions) {
        //first small running if s=2 f=1
        //first small complete if s=2 f=2
        //second small running if s=4 f=3
        //second small complete if s=4 f=4
        //last circle running if s=6 f=5
        //last circle complete if s=0 f=0 && previous bullets colored
    }
    
    return {
        createCircles: createCircles,
        resetTimeline: resetTimeline,
    };
})();