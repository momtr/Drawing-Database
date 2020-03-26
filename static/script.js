// DrawingAI

// host
//const host = "http://127.0.0.1:3000";
const host = "drawing-ai.herokuapp.com";
//endpoint = en => host + "/" + en;
endpoint = en => "/" + en;


// diable scrolling
scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
// if any scroll is attempted, set this to the previous value 
window.onscroll = function() { 
    window.scrollTo(scrollLeft, scrollTop); 
}; 


let word;
let time = 20;
let path = [];
let drawing = [];
let isDrawing = false;
let drawingSize; 
let tick = 0;
let timeDOM;

function preload() {
    // get the words from the API
    fetch(endpoint('word'))
        .then(res => {
            return res.json();
        })
        .then(data => {
            setWord(data.word);
        });
}

function setup() {
    drawingSize = (innerWidth > 500 ? 500 : innerWidth);
    let margin = (innerWidth - drawingSize) / 2 + "px";
    canvas = createCanvas(drawingSize, drawingSize);
    canvas.mousePressed(startDrawing);
    canvas.mouseReleased(endDrawing);
    canvas.parent('sketch');
    $('#sketch').css('margin-left', margin);
}

function draw() {
    background('#23243A'); 
    if(isDrawing) {
        path.push({
            x: mouseX,
            y: mouseY
        });
    }
    stroke(255);
    strokeWeight(8);
    noFill();
    for(let i = 0; i < drawing.length; i++) {
        let currentPath = drawing[i];
        beginShape();
        for(let j = 0; j < currentPath.length; j++) {
            vertex(currentPath[j].x, currentPath[j].y);
        }
        endShape();
    }
    if(mouseX <= 0 || mouseY <= 0 || mouseX >= drawingSize || mouseY >= drawingSize)
        endDrawing();
    tick++;
    // every second
    if((tick % 30) == 0) {
        time--;
        if(time == 0) {
            savePainting();
        }
        // update time
        $('#time').html(time + "s" + " | " + word);
    }
}

function startDrawing() {
    isDrawing = true;
    path = [];
    drawing.push(path);
}

function endDrawing() {
    isDrawing = false;
}

function savePainting() {
    // if time = 0 or if user presses next
    // send data to backend
    fetch(endpoint('saveDrawing'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: { drawing, drawingSize, word, time, touches }
        })
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            // we get a new word back
            setWord(data.word);
            // delete the drawing
            deleteDrawing();
            // reset timer
            resetTimer();
        })
}

function deleteDrawing() {
    drawing = [];
}

function resetTimer() {
    time = 21;
}

function setWord(newWord) {
    word = newWord;
}