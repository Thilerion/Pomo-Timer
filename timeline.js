/*jshint devel: true, esversion: 6, browser: true*/
var timeline = (function () {

    let flexDiv = document.querySelector(".timeline-flex-container");
    let circleStart = document.querySelector(".flex-circle-start");
    let circleEnd = document.querySelector(".flex-circle-end");

    function returnToBaseline() {
        /*
        let generatedChildren = flexDiv.querySelectorAll("div.flex-small-circle, div.flex-line");
        console.log(generatedChildren);

        //remove all small-circle and line children
        generatedChildren.forEach(function (e) {
            e.parentNode.removeChild(e);
        });

        //remove running and finished
        circleStart.classList.remove("circle-finished");
        circleStart.classList.add("circle-running");
        circleEnd.classList.remove("circle-running", "circle-finished"); */
        console.log("Tries to update timeline to default, but there is no timeline.");
    }

    function initTimeline(length) {
        /*
        let nSmallCircles = length - 1;

        returnToBaseline();

        for (let i = 0; i < nSmallCircles; i++) {            
            let line = document.createElement("div");
            let lineRunning = document.createElement("div");
            let circle = document.createElement("div");
            line.classList.add("flex-line");
            lineRunning.classList.add("flex-line-running");
            line.appendChild(lineRunning);
            circle.classList.add("flex-circle", "flex-small-circle");
            flexDiv.insertBefore(line, circleEnd);
            flexDiv.insertBefore(circle, circleEnd);
        }

        let lastLine = document.createElement("div");
        let lastLineRunning = document.createElement("div");
        lastLine.classList.add("flex-line");
        lastLineRunning.classList.add("flex-line-running");
        lastLine.appendChild(lastLineRunning);
        
        flexDiv.insertBefore(lastLine, circleEnd);
        */
        console.log("Tries to initiate timeline, but this is not possible.");
    }
    
    function updateAllCircleStates(props) {
        /*
        let circleSmallArr = document.querySelectorAll(".flex-small-circle");
        
        circleStart.classList.toggle("circle-finished", props.start.finished);
        circleStart.classList.add("circle-running");
        
        circleEnd.classList.toggle("circle-running", props.last.running);
        circleEnd.classList.toggle("circle-finished", props.last.finished);
        
        props.small.forEach(function(el) {
            let circle = circleSmallArr[el.n];
            circle.classList.toggle("circle-running", el.running);
            circle.classList.toggle("circle-finished", el.finished);
        });*/
        console.log("Tries to update circle states on timeline, but there is no timeline.");
    }
    
    function updateAllLines(props) {
        /*
        let lines = document.querySelectorAll(".flex-line-running");
        props.forEach(function(el, i) {
            let percentage = (el * 100).toFixed(2);
            console.log("Percentage of line " + i + " is " + percentage);
            if (percentage > 0 && percentage < 100) {
                lines[i].classList.add("flex-line-current");
            } else {
                lines[i].classList.remove("flex-line-current");
            }
            
            if (percentage > 99.5 && percentage < 100) {
                percentage = 99.5;
            }
            lines[i].style.width = percentage + "%";
        });*/
        console.log("Tries to update lines on the timeline, but there is no timeline.");
    }

    return {
        initTimeline: initTimeline,
        updateCircleStates: updateAllCircleStates,
        updateLine: updateAllLines
    };
})();
