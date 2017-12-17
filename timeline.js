/*jshint devel: true, esversion: 6, browser: true*/
var timeline = (function () {

    let flexDiv = document.querySelector(".timeline-flex-container");
    let circleStart = document.querySelector(".flex-circle-start");
    let circleEnd = document.querySelector(".flex-circle-end");

    function returnToBaseline() {
        let generatedChildren = flexDiv.querySelectorAll("div.flex-small-circle, div.flex-line");
        console.log(generatedChildren);

        //remove all small-circle and line children
        generatedChildren.forEach(function (e) {
            e.parentNode.removeChild(e);
        });

        //remove running and finished
        circleStart.classList.remove("circle-finished");
        circleStart.classList.add("circle-running");
        circleEnd.classList.remove("circle-running", "circle-finished");
    }

    function initTimeline(length) {
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
    }
    
    function updateAllCircleStates(props) {
        let circleSmallArr = document.querySelectorAll(".flex-small-circle");
        
        circleStart.classList.toggle("circle-finished", props.start.finished);
        circleStart.classList.add("circle-running");
        
        circleEnd.classList.toggle("circle-running", props.last.running);
        circleEnd.classList.toggle("circle-finished", props.last.finished);
        
        props.small.forEach(function(el) {
            let circle = circleSmallArr[el.n];
            circle.classList.toggle("circle-running", el.running);
            circle.classList.toggle("circle-finished", el.finished);
        });
    }
    
    function updateAllLines() {
        /*let lineN = workN;
        let line = document.querySelectorAll(".flex-line-running")[lineN];
        percentage *= 100;
        
        console.log(line);
        
        line.style.width = percentage + "%";*/
    }

    return {
        initTimeline: initTimeline,
        updateCircleStates: updateAllCircleStates,
        updateLine: updateAllLines
    };
})();
