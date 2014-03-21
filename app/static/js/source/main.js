(function(){

  'use strict';
  //var BufferLoader = require('./bufferloader');
  var context;
  var drums;
  //var startTime;
  var tempo;
  var lookahead = 25.0;       // How frequently to call scheduling function
                              //(in milliseconds)
  var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                              // This is calculated from lookahead, and overlaps
                              // with next interval (in case the timer is late)
  var nextNoteTime = 0.0;     // when the next note is due.
  var isPlaying = false;      // Are we currently playing?
  var current16thNote;        // What note is currently last scheduled?
  var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
  var noteLength = 0.05;      // length of "beep" (in seconds)
  var timerID = 0;            // setInterval identifier.

  var canvas,                 // the canvas element
      canvasContext;          // canvasContext is the canvas' context 2D
  var last16thNoteDrawn = -1; // the last "box" we drew on the screen
  var notesInQueue = [];      // the notes that have been put into the web audio,
                              // and may or may not have played yet. {note, time}


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createAnimFrame();
    createCanvas();
    createContext();
    createDrums();
    $('#kick').click(playKick);
    $('#snare').click(playSnare);
    $('#hat').click(playHat);
    $('#play').click(play);
  }

//------AnimationFrame code block------//
  function createAnimFrame(){
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
  }

  function createCanvas(){
    var container = document.createElement( 'div' );
    container.className = 'container';
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild( container );
    container.appendChild(canvas);
    canvasContext.strokeStyle = '#ffffff';
    canvasContext.lineWidth = 2;
    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;
    requestAnimFrame(draw);    // start the drawing loop.
  }

  function resetCanvas (e){
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0);
  }

  function draw(){
    var currentNote = last16thNoteDrawn;
    var currentTime = context.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
      currentNote = notesInQueue[0].note;
      notesInQueue.splice(0,1);   // remove note from queue
    }

      // We only need to draw if the note has moved.
    if (last16thNoteDrawn !== currentNote) {
      var x = Math.floor( canvas.width / 18 );
      canvasContext.clearRect(0,0,canvas.width, canvas.height);
      for (var i=0; i<16; i++) {
        canvasContext.fillStyle = ( currentNote === i ) ?
        ((currentNote%4 === 0)?'red':'blue') : 'black';
        canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
      }
      last16thNoteDrawn = currentNote;
    }

      // set up to draw again
    requestAnimFrame(draw);
  }

//------AudioContext code block------//
  function createContext(){
    try{
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new webkitAudioContext();
    }catch(e){
      alert('Web Audio API is not supported by this browser');
    }
  }

  function createDrums(){
    drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], alert('Welcome to MegaHurt'));
    drums.load();
  }

/*function playBeat(bufferList){
    var kick = bufferList[0];
    var snare = bufferList[1];
    var hat = bufferList[2];
    startTime = context.currentTime + (1/10);
    var tempo = 80;
    var eighthNoteTime = (60/tempo)/2;

    for(var bar = 0; bar < 2; bar++){
      var time = startTime + bar * 8 * eighthNoteTime;

      playSound(kick, time);
      playSound(kick, time + 4 * eighthNoteTime);

      playSound(snare, time + 2 * eighthNoteTime);
      playSound(snare, time + 6 * eighthNoteTime);

      for (var i = 0; i < 8; i++){
        playSound(hat, time + i * eighthNoteTime);
      }
    }
  }*/

/*function playSound(buffer, time){
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }*/

  function playKick(){
    var source = context.createBufferSource();
    source.buffer = drums.bufferList[0];
    source.connect(context.destination);
    source.start(0);
  }

  function playSnare(){
    var source = context.createBufferSource();
    source.buffer = drums.bufferList[1];
    source.connect(context.destination);
    source.start(0);
  }

  function playHat(){
    var source = context.createBufferSource();
    source.buffer = drums.bufferList[2];
    source.connect(context.destination);
    source.start(0);
  }

//------Timer code block------//
  function play(){
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
      current16thNote = 0;
      nextNoteTime = context.currentTime;
      scheduler();    // kick off scheduling
      return 'stop';
    } else {
      window.clearTimeout(timerID);
      return 'play';
    }
  }

  function scheduler(){
      // while there are notes that will need to play before the next interval,
      // schedule them and advance the pointer.
    while (nextNoteTime < context.currentTime + scheduleAheadTime ) {
      scheduleNote( current16thNote, nextNoteTime );
      nextNote();
    }
    timerID = window.setTimeout( scheduler, lookahead );
  }

  function scheduleNote( beatNumber, time ){
      // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ((noteResolution === 1) && (beatNumber%2)){
      return; // we're not playing non-8th 16th notes
    }
    if ((noteResolution === 2) && (beatNumber%4)){
      return; // we're not playing non-quarter 8th notes
    }
    if (beatNumber % 16 === 0){    // beat 0 == low pitch
      playKick();
    }else if (beatNumber % 4){    // quarter notes = medium pitch
      playSnare();
    }else{                        // other 16th notes = high pitch
      playHat();
    }
  }

  function nextNote(){
      // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                            // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote === 16) {
      current16thNote = 0;
    }
  }

  //window.addEventListener('load', init);

})();
