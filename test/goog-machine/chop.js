function init() {
    var audioBuffer = context.createBuffer(1, 1024, 44100.0);
    initCanvas();
    initDrums();
}


//////// CANVAS ////////
var canvas; // called in handleMouseDown(), init()
var canvasContext;
var canvasWidth = 0;
var canvasHeight = 0;
var gridColor = "rgb(192,192,192)";
var playheadColor = "rgb(80, 100, 80)";
var noteColor = "rgb(200,60,20)";

function initCanvas() {
    canvas = document.getElementById('canvasID');

    canvas.addEventListener("mousedown", handleMouseDown, true);
    canvas.addEventListener("mousemove", handleMouseMove, true);
    canvas.addEventListener("mouseup", handleMouseUp, true);

    canvasWidth = parseFloat(window.getComputedStyle(canvas, null).width);
    canvasHeight = parseFloat(window.getComputedStyle(canvas, null).height);

    drawDrumGrid();

    for (i = 0; i < 16; ++i) {
        drawNote(rhythm1[i], i, 0);
        drawNote(rhythm2[i], i, 1);
        drawNote(rhythm3[i], i, 2);
        drawNote(rhythm4[i], i, 3);
        drawNote(rhythm5[i], i, 4);
        drawNote(rhythm6[i], i, 5);
    }
}

function drawNote(draw, xindex, yindex) {
    var noteSize = canvasWidth / 16.0;

    var gridX = xindex * noteSize;
    var gridY = yindex * noteSize

    var radius = 10;
    if (draw == 1) {
        canvasContext.fillStyle = noteColor;
        radius = 10;
    } else {
        canvasContext.fillStyle = "rgb(255,255,255)";
        radius = 12;
    }

    canvasContext.beginPath();
    canvasContext.arc(gridX + 0.5*noteSize, gridY + 0.5*noteSize, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function drawPlayhead(xindex) {
    var noteSize = canvasWidth / 16.0;

    var yindex = 0;

    var kInset = 2;

    var lastIndex = (xindex - 1 + 16) % 16;

    for (i = 0; i < kNumInstruments; ++i) {
        // erase old playhead
        canvasContext.strokeStyle = gridColor;
        canvasContext.lineWidth = 3;
        canvasContext.strokeRect(lastIndex * noteSize + kInset, i * noteSize + kInset, noteSize - 2*kInset, noteSize - 2*kInset);

        // draw new playhead
        canvasContext.strokeStyle = playheadColor;
        canvasContext.lineWidth = 2;
        canvasContext.strokeRect(xindex    * noteSize + kInset, i * noteSize + kInset, noteSize - 2*kInset, noteSize - 2*kInset);
    }
}

function drawDrumGrid() {
    // draw center
    var width = canvas.width;
    var height = canvas.height;

    // canvasContext.strokeStyle = "rgb(150, 255, 150)";
    canvasContext.strokeStyle = gridColor;
    canvasContext.lineWidth = 3;

    var noteSize = width / 16.0;
    var kInset = 2;

    for (inst = 0; inst < kNumInstruments; ++inst) {
        for (i = 0; i < 16; ++i) {
            canvasContext.strokeRect(i * noteSize + kInset, kInset + inst*noteSize, /* What The Fuck Goes Here? */ noteSize - 2*kInset, noteSize - 2*kInset);
        }
    }
}


//////// EVENTS ////////
var gIsMouseDown = false;
var gLastX = 0;
var gLastY = 0;
// Events
function handleMouseDown(event) {
    gIsMouseDown = true;

    var posx = event.clientX;
    var posy = event.clientY;

    var eventInfo = {event: event, element:canvas};

    var c = getRelativeCoordinates(eventInfo);
    var x = c.x;
    var y = c.y;

    var noteSize = canvasWidth / 16.0;
    var kInset = 2;

    var gridIndex = Math.floor(x / noteSize);
    var instrumentIndex = Math.floor(y / noteSize);

    var notes = rhythm1;

    switch (instrumentIndex) {
        case 0: notes = rhythm1; break;
        case 1: notes = rhythm2; break;
        case 2: notes = rhythm3; break;
        case 3: notes = rhythm4; break;
        case 4: notes = rhythm5; break;
        case 5: notes = rhythm6; break;
    }

    notes[gridIndex] = 1 - notes[gridIndex];

    var gridX = gridIndex * noteSize;

    drawNote(notes[gridIndex], gridIndex, instrumentIndex);
}
// Events
function handleMouseUp(event) {
    gIsMouseDown = false;
}
// Events
function handleMouseMove(event) {
    if (gIsMouseDown) {
    }
}
