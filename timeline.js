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
        let lastCircle = document.querySelector(".circle-end");
        
        smallCircles.forEach(function(el) {
            el.remove();
        });
        
        lastCircle.classList.remove("started-circle");
        lastCircle.classList.remove("active-circle");
        
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

    function updateActiveCircles(props) {
        //first small running if s=2 f=1
        //first small complete if s=2 f=2
        //second small running if s=4 f=3
        //second small complete if s=4 f=4
        //last circle running if s=6 f=5
        //last circle complete if s=0 f=0 && previous bullets colored
        if (props.s.name === "short") {
            let circleN = Math.floor(props.n / 2) + 1;
            let el = document.querySelector(".circle" + circleN);
            console.log(el);
            if (props.s.hasStarted === true) {
                el.classList.add("started-circle");
            }
            if (props.s.hasFinished === true) {
                el.classList.add("active-circle");
            }
        }
        if (props.s.name === "long") {
            let el = document.querySelector(".circle-end");
            if (props.s.hasStarted === true) {
                el.classList.add("started-circle");
            }
            if (props.s.hasFinished === true) {
                el.classList.add("active-circle");
            }
        }
    }
    
    //TODO RESET CIRCLES AT END
    //TODO NUMBER OF ELEMENT TO CHANGE
    //TODO RIGHT PLACE TO ADD FINISHED CIRCLE CLASS
    
    return {
        createCircles: createCircles,
        resetTimeline: resetTimeline,
        updateActiveCircles: updateActiveCircles
    };
})();