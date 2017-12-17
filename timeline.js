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
        circleStart.classList.remove("circle-running");
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
        /*let smallCircles = document.querySelectorAll(".flex-small-circle");
        
        props[0].forEach(function(e, ind) {
            if (e.name === "short") {
                let n = e.typeNumber - 1;
                console.log(flexDiv);
                console.log(smallCircles[n]);
                if (e.timeline.circleFinished === true) {
                    smallCircles[n].classList.add("circle-finished");
                } else {
                    smallCircles[n].classList.remove("circle-finished");
                }
                
                if (e.timeline.circleRunning === true) {
                    smallCircles[n].classList.add("circle-running");
                } else {
                    smallCircles[n].classList.remove("circle-running");
                }                
            } else if (e.name === "long") {
                let longInd = ind;
                if (e.timeline.circleFinished === true) {
                    circleEnd.classList.add("circle-finished");
                } else {
                    circleEnd.classList.remove("circle-finished");
                }
                
                if (e.timeline.circleRunning === true) {
                    circleEnd.classList.add("circle-running");
                } else {
                    circleEnd.classList.remove("circle-running");
                }
            }
        });*/
    }
    
    function updateLine(workN, percentage) {
        /*let lineN = workN;
        let line = document.querySelectorAll(".flex-line-running")[lineN];
        percentage *= 100;
        
        console.log(line);
        
        line.style.width = percentage + "%";*/
    }

    return {
        initTimeline: initTimeline,
        updateCircleStates: updateAllCircleStates,
        updateLine: updateLine
    };
})();
