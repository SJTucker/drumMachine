var audioContext = null;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 80;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
//(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps 
// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = .1;      // length of "beep" (in seconds)
var timerID = 0;            // setInterval identifier.

var canvas,                 // the canvas element
canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,

var pendingQ = [];
var scheduledQ = [];
var playingQ = [];
var mostRecentNoteTime = 0;

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function noteScheduler() {

  // Add next notes to the pendingQ based on next lookahead and current BPS.
  var spb = 60/tempo;
  var currentTime = audioContext.currentTime;
  var nextNoteTime = Math.ceil(currentTime/spb) * spb;
  nextNoteTime = Math.max(mostRecentNoteTime + spb, nextNoteTime);
  var newNotes = [];
  for (var i = nextNoteTime; i < currentTime + 2*(lookahead/1000); i += spb){
    var note = {
      start: i,
      length: noteLength
    };
    mostRecentNoteTime = i;
    newNotes.push(note);
  }
  if (newNotes.length){
    for (var i=0; i < newNotes.length; i++){
      pendingQ.push(newNotes[i]);
    }
  }

  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  var idx = pendingQ.length;
  while(idx--){
    var note = pendingQ[idx];
    //if (note.start < audioContext.currentTime + scheduleAheadTime){
    if (true){
      scheduleNote(note);
      pendingQ.splice(idx,1);
      scheduledQ.push(note);
    }
  }
  timerID = window.setTimeout(noteScheduler, lookahead );
}

function scheduleNote(note) {
  var osc = audioContext.createOscillator();
  osc.connect( audioContext.destination );
  osc.frequency.value = 440.0 + 110 * Math.round(3 * Math.random());
  osc.start( note.start);
  osc.stop( note.start + note.length );
}

function play() {
  isPlaying = !isPlaying;

  var osc = audioContext.createOscillator();
  osc.connect( audioContext.destination );
  osc.frequency.value = 440.0;
  osc.start(0);
  osc.stop(.001);

  if (isPlaying) { // start playing
    noteScheduler();    // kick off scheduling
    return "stop";
  } else {
    window.clearTimeout( timerID );
    return "play";
  }
}

function addNotes(options){
  options = options || {};
  var bpm = options.bpm || 120;
  var spb = 60.0/(bpm);
  var numNotes = options.numNotes || 4;

  var currentTime = audioContext.currentTime;
  for (var i=0; i < numNotes; i++){
    pendingQ.push({
      start: currentTime + (i * spb),
      length: noteLength
    });
  }
}

function generateNotes(){
  var notes = [];
  var currentTime = audioContext.currentTime;
  for (var i=0; i<5; i++){
    notes.push({start: currentTime + (i * noteLength), length: noteLength});
  }
  return notes;
}

function loop() {
  var currentTime = audioContext.currentTime;

  var scheduledIdx = scheduledQ.length;
  while (scheduledIdx--){
    var note = scheduledQ[scheduledIdx];
    if (note.start < currentTime){
      scheduledQ.splice(scheduledIdx,1);
      playingQ.push(note);
      onNoteStart(note);
    }
  }

  var playingIdx = playingQ.length;
  while (playingIdx--){
    var note = playingQ[playingIdx];
    if ((note.start + note.length )< currentTime){
      playingQ.splice(playingIdx,1);
      onNoteStop(note);
    }
  }

  // Add next notes.

  requestAnimFrame(loop);
}

addClass = function (el, cl) {
  el.className += ' ' + cl;
},
removeClass = function (el, cl) {
  var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
  el.className = el.className.replace(regex, ' ');
},

pulse = document.getElementById('pulse');
function onNoteStart(note){
  console.log("started note: ", note);
  removeClass(pulse, 'pulsing');
}

function onNoteStop(note){
  console.log("stopped note: ", note);
  addClass(pulse, 'pulsing');
}

function init(){
  audioContext = new AudioContext();
  requestAnimFrame(loop);    // start the drawing loop.
}

window.addEventListener("load", init );
