(function(){

  'use strict';

//////// DOCUMENT READY ////////
  $(document).ready(init);

  function init(){
    $(document).foundation();
    createCanvas();
    createAudioContext();
    createDrums();
    $('#play').click(play);
    $('#setTempo').click(setTempo);
    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;
    requestAnimFrame(draw);
  }

//////// SETUP ////////
  function setTempo(){
    tempo = $('#tempo').val();
  }

//////// GLOBALS ////////
  var drums;
  var current16thNote;
  var nextNoteTime = 0.0;
  var lap = 25.0;
  var lookAhead = 0.1;
  var tempo = 120.0;
  var isPlaying = false;
  var timerID = 0;
  var source;
  var canvas;
  var canvasContext;
  var last16thNoteDrawn = -1;
  var notesInQueue = [];


//////// CANVAS and ANIMATION FRAME ////////
  function createCanvas(){
    var container = document.createElement( 'div' );
    container.className = "container";
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild( container );
    container.appendChild(canvas);
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;
  }

  window.requestAnimFrame = (function(){
    return(
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( callback ){
          window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = context.currentTime;
    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
      currentNote = notesInQueue[0].note;
      notesInQueue.splice(0,1);
    }
    if (last16thNoteDrawn != currentNote) {
      var x = Math.floor(canvas.width / 18);
      canvasContext.clearRect(0,0,canvas.width, canvas.height);
      for (var i=0; i<16; i++) {
        canvasContext.fillStyle = (currentNote == i) ?
          ((currentNote%4 === 0)?"red":"blue") : "black";
        canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
      }
      last16thNoteDrawn = currentNote;
    }
    requestAnimFrame(draw);
  }

  function resetCanvas (e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.scrollTo(0,0);
  }


//////// KITS ////////
  function createAudioContext(){
    context = new webkitAudioContext();
  }

  function createDrums(){
    drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], console.log('Welcome to MegaHurt'));
    drums.load();
  }

  function playKick(){
    source = context.createBufferSource();
    source.buffer = drums.bufferList[0];
    source.connect(context.destination);
    source.start(0);
  }

  function playSnare(){
    source = context.createBufferSource();
    source.buffer = drums.bufferList[1];
    source.connect(context.destination);
    source.start(0);
  }

  function playHat(){
    source = context.createBufferSource();
    source.buffer = drums.bufferList[2];
    source.connect(context.destination);
    source.start(0);
  }


//////// PLAYBACK ////////
  var context;
  // Kick // called in initCanvas(), handleMouseDown()
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
  // Snare // called in initCanvas(), handleMouseDown()
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
  // Hats // called in initCanvas(), handleMouseDown()
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
  var sampleRate = 44100.0;
  var nyquist = sampleRate * 0.5;
  var startTime; // called in finishLoading()
  var loopLength = 16;
  var rhythmIndex = 0;
  var loopNumber = 0;
  var tempo = 115.0; // called in finishLoading()
  var noteTime = 0.0;
  var lastDrawTime = -1;

  function play(){
    isPlaying = !isPlaying;

    if(isPlaying){
      current16thNote = 0;
      nextNoteTime = context.currentTime;
      scheduler();
      return 'stop';/////switch with toggle
    }else{
      window.clearTimeout(timerID);
      return 'play';//////switch with toggle
    }
  }

  function scheduler(){
    while(nextNoteTime < context.currentTime + lookAhead){
      scheduleNote(current16thNote, nextNoteTime);
      nextNote();
    }
    timerID = window.setTimeout(scheduler, lap);
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
  function scheduleNote(beatNumber, time){
   /* var osc = context.createOscillator();
    osc.connect(context.destination);

    if(beatNumber % 16 === 0){
      osc.frequency.value = 220.0;
    }else if(beatNumber % 4){
      osc.frequency.value = 440.0;
    }else{
      osc.frequency.value = 880;
    }

    osc.start(time);
    osc.stop(time + noteLength);*/
    notesInQueue.push( { note: beatNumber, time: time } );
    if(beatNumber % 16 === 0){
      playKick();
    }else if(beatNumber % 4){
      playHat();
    }else{
      playSnare();
    }
  }
/* Old nextNote() function
  function nextNote(){
    var secondsPerBeat = 60.0/tempo;
    nextNoteTime += 0.25 * secondsPerBeat;
    current16thNote++;
    if(current16thNote === 16){
      current16thNote = 0;
    }
  }
*/
  function advanceNote() {
    var secondsPerBeat = 60.0/tempo;
    noteTime += 0.25 * secondsPerBeat;

    rhythmIndex++;
    if (rhythmIndex == loopLength) {
      rhythmIndex = 0;
      loopNumber++
    }
  }


})();
