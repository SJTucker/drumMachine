function init() {
    context = new webkitAudioContext();
    var audioBuffer = context.createBuffer(1, 1024, 44100.0);
    initCanvas();
}


/////// KITS ///////
var kits;
var currentKit = 0;
var kitCount = 0;
var kNumInstruments = 3;
var isLoaded = false;
var errorCount = 0;
var successCount = 0;
var kitNames = [
  "Drums-of-Death",
  "Earthquake-Ruckus",
  "God-vs-Satan",
];
//------ Initialize Drum Kits ------//
var numKits = kitNames.length;
kits = new Array(numKits);
for (var i  = 0; i < numKits; i++) {
    kits[i] = new Kit(kitNames[i]);
}
//------ Kit Constructor ------//
//Variables: pathName, kNumInstruments
function Kit(name) {
    this.name = name;
    this.pathName = function() {
        var pathName = "audios/drums/" + this.name + "/";
        return pathName;
    };
    //var pathName = this.pathName();
    var kickPath = this.pathName + "kick.wav";
    var snarePath = this.pathName + "snare.wav";
    var hatPath = this.pathName + "hat.wav";

    this.kickBuffer = 0;
    this.snareBuffer = 0;
    this.hatBuffer = 0;

    this.instrumentCount = kNumInstruments;
    this.instrumentLoadCount = 0;

    this.loadSample(0, kickPath, false);
    this.loadSample(1, snarePath, false);
    this.loadSample(2, hatPath, false);
}
//------ Loads Drum Samples ------//
Kit.prototype.loadSample = function(sampleID, url, mixToMono) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var kit = this;

    request.onload = function() {
        context.decodeAudioData(
            request.response, function(buffer) {
                // var buffer = context.createBuffer(request.response, mixToMono);
                switch (sampleID) {
                    case 0: kit.kickBuffer = buffer; break;
                    case 1: kit.snareBuffer = buffer; break;
                    case 2: kit.hatBuffer = buffer; break;
                }
                successCount++;
                var info = document.getElementById("info");
                info.innerHTML = errorCount + " " + successCount;
                kit.instrumentLoadCount++;
                if (kit.instrumentLoadCount == kit.instrumentCount)
                  finishLoading();
                }
            },
            function() {
                errorCount++;
                var info = document.getElementById("info");
                info.innerHTML = errorCount + " " + successCount;
            }
        );
    }
    request.send();
}
//------ Returns Kit Name When Selected ------//
function getKitString(index) {
    var name = kitNames[index];
    return "<li onmousedown=\"currentKit = kits[" + index + "]; highlightElement(this); \">" + name + "</li> ";
}
// Called when all audio assets are finished loading //
function finishLoading() {
    kitCount++;
    if (kitCount < kitNames.length) return;

    if (isLoaded) return;

    // get rid of loading animation
    var loading = document.getElementById("loading");
    loading.innerHTML = "";

    isLoaded = true;

    // Setup initial drumkit
    currentKit = kits[4];

    makeKitsList();

    addSlider("tempo");
    addSlider("kick_cutoff");
    addSlider("snare_cutoff");
    addSlider("hihat_cutoff");
    addSlider("reverb");

    configureSlider("tempo", tempo, 50.0, 180.0, tempoHandler);
    configureSlider("kick_cutoff", 0.99, 0.0, 1.0, cutoffKickHandler);
    configureSlider("snare_cutoff", 0.99, 0.0, 1.0, cutoffSnareHandler);
    configureSlider("hihat_cutoff", 0.99, 0.0, 1.0, cutoffHihatHandler);
    configureSlider("reverb", reverbMix, 0.0, 1.0, reverbHandler);

    startTime = context.currentTime + 0.160;

    // Start playing
    schedule();
}


//////// SEQUENCE and PLAYBACK ////////
// Kick //
var rhythm1 = [
  1,
  0,
  0,
  0,

  0,
  0,
  0,
  0,

  1,
  0,
  1,
  0,

  0,
  0,
  0,
  0
];
// Snare //
var rhythm2 = [
  0,
  0,
  0,
  0,

  1,
  0,
  0,
  0,

  0,
  0,
  0,
  0,

  1,
  0,
  0,
  0
];
// Hats //
var rhythm3 = [
  0,
  0,
  1,
  0,

  0,
  0,
  1,
  0,

  0,
  0,
  1,
  0,

  0,
  0,
  1,
  1
];
var context;
var sampleRate = 44100.0;
var nyquist = sampleRate * 0.5;
var startTime;
var loopLength = 16;
var rhythmIndex = 0;
var loopNumber = 0;
var tempo = 115.0;
var noteTime = 0.0;
//------ Sets NextNoteTime, Advances RhythmIndex ------//
function advanceNote() {
    var secondsPerBeat = 60.0 / tempo;
    noteTime += 0.25 * secondsPerBeat;

    rhythmIndex++;
    if (rhythmIndex == loopLength) {
        rhythmIndex = 0;
        loopNumber++
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, cutoff, resonance, noteTime) {
    // Create the note
    var voice = context.createBufferSource();
    voice.buffer = buffer;

    // Connect to filter
    var hasBiquadFilter = context.createBiquadFilter;
    var filter = hasBiquadFilter ? context.createBiquadFilter() : context.createLowPass2Filter();

    if (hasBiquadFilter) {
        filter.frequency.value = cutoff;
        filter.Q.value = resonance; // this is actually resonance in dB
    } else {
        filter.cutoff.value = cutoff;
        filter.resonance.value = resonance;
    }

    voice.connect(filter);

    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = context.createPanner();
        panner.panningModel = webkitAudioPannerNode.HRTF;
        panner.setPosition(x, y, z);
        filter.connect(panner);
        finalNode = panner;
    } else {
        finalNode = filter;
    }

    // Connect to dry mix
    var dryGainNode = context.createGain();
    dryGainNode.gain.value = mainGain;
    finalNode.connect(dryGainNode);
    dryGainNode.connect(compressor);

    // Connect to wet mix
    var wetGainNode = context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);
    wetGainNode.connect(convolver);

    voice.start(noteTime);
}

function schedule() {
    var currentTime = context.currentTime;
    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= startTime;
    var resonance = 5.0;
    while (noteTime < currentTime + 0.200) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + startTime;
        // Kick
        if (rhythm1[rhythmIndex] == 1) {
            playNote(currentKit.kickBuffer, false, 0,0,-2, 0.5 * reverbMix, 1.0, kickCutoff, resonance, contextPlayTime);
        }
        // Snare
        if (rhythm2[rhythmIndex] == 1) {
            playNote(currentKit.snareBuffer, false, 0,0,-2, reverbMix, 0.6, snareCutoff, resonance, contextPlayTime);
        }
        // Hihat
        if (rhythm3[rhythmIndex] == 1) {
            // Pan the hihat according to sequence position.
            playNote(currentKit.hihatBuffer, true, 0.5*rhythmIndex - 4, 0, -1.0, reverbMix, 0.7, hihatCutoff, resonance, contextPlayTime);
        }
        // Toms
        if (rhythm4[rhythmIndex] == 1) {
            playNote(currentKit.tom1, false, 0,0,-2, reverbMix, 0.6, nyquist, resonance, contextPlayTime);
        }
        if (rhythm5[rhythmIndex] == 1) {
            playNote(currentKit.tom2, false, 0,0,-2, reverbMix, 0.6, nyquist, resonance, contextPlayTime);
        }
        if (rhythm6[rhythmIndex] == 1) {
            playNote(currentKit.tom3, false, 0,0,-2, reverbMix, 0.6, nyquist, resonance, contextPlayTime);
        }
        // Attempt to synchronize drawing time with sound
        if (noteTime != lastDrawTime) {
            lastDrawTime = noteTime;
            drawPlayhead(rhythmIndex);
        }
        advanceNote();
    }

    setTimeout("schedule()", 0);
}


//////// CANVAS ////////
var canvas;
var canvasContext;
var canvasWidth = 0;
var canvasHeight = 0;
var lastDrawTime = -1;
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
            canvasContext.strokeRect(i * noteSize + kInset, kInset + inst*noteSize,              noteSize - 2*kInset, noteSize - 2*kInset);
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
