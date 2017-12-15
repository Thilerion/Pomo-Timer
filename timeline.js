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
    
    function updateCircleStates(props) {
        let smallCircles = document.querySelectorAll(".flex-small-circle");
        
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
        });
    }
    
    function updateLine(workN, percentage) {
        let lineN = workN - 1;
        let line = document.querySelectorAll(".flex-line-running")[lineN];
        
        console.log(line);
        
        line.style.width = percentage + "%";
    }

    /*function updateActiveCircles(props) {
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
    
    let mainTimelineDiv = document.querySelector(".timeline-line");
    
    function initTimeline(sesAr, length) {
        //first remove all elements in the mainTimelineDiv
        while (mainTimelineDiv.hasChildNodes()) {
            mainTimelineDiv.removeChild(mainTimelineDiv.firstChild);
        }
        
        //calculate percentage
        let percentage = 100/length;
        
        let elements = [];
        elements.push(createTimelineLineFilling());
        elements.push(createLargeCircle(0, true, true));
        
        sesAr.forEach(function(item) {
            if (item.name === "short") {
                elements.push(createSmallCircle(item.typeNumber, (item.typeNumber*percentage) , item.timeline.circleFinished, item.timeline.circleRunning));
            }
        });
        
        let elLong = sesAr[(sesAr.length - 1)];
        
        elements.push(createLargeCircle(1, elLong.timeline.circleFinished, elLong.timeline.circleRunning));
        
        console.log(elements);
        
        elements.forEach(function(el) {
            mainTimelineDiv.appendChild(el);
        });
    }
    
    function createTimelineLineFilling() {
        let el = document.createElement("div");
        el.classList.add("timeline-line-filling-container");
        return el;
    }
    
    function createLargeCircle(pos, finished, running) {
        let el = document.createElement("div");
        
        let classes = ["circle", "circle-large"];
        if (pos === 0) {
            classes.push("circle-start");
        } else if (pos === 1) {
            classes.push("circle-end");
        }
        
        if (finished === true) {
            classes.push("circle-finished");
        }
        
        if (running === true) {
            classes.push("circle-running");
        }
        
        el.classList.add(...classes);
        return el;
    }
    
    function createSmallCircle(n, percentage, finished, running) {
        let el = document.createElement("div");
        
        let classes = ["circle", "circle-small"];
        let circleN = "circle" + n + "";
        classes.push(circleN);
        
        if (finished === true) {
            classes.push("circle-finished");
        }
        
        if (running === true) {
            classes.push("circle-running");
        }
        
        el.classList.add(...classes);
        
        el.style.left = percentage + "%";
        
        return el; 
    }*/

    //TODO RESET CIRCLES AT END
    //TODO NUMBER OF ELEMENT TO CHANGE
    //TODO RIGHT PLACE TO ADD FINISHED CIRCLE CLASS

    return {
        initTimeline: initTimeline,
        updateCircleStates: updateCircleStates,
        updateLine: updateLine
    };
})();
