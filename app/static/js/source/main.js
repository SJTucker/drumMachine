(function(){

  'use strict';


//////// DOCUMENT READY ////////
  $(document).ready(init);

  function init(){
    $(document).foundation();
    //createCanvas();
    createAudioContext();
    initDrums();
    $('#play').click(play);
    $('#setTempo').click(setTempo);
    //window.onorientationchange = resetCanvas;
    //window.onresize = resetCanvas;
    //requestAnimFrame(draw);
    $('select#kit').change(changeKit);
  }


//////// CONTROLS ////////
  var currentKit;
  var tempo = 100.0;

  function setTempo(){
    tempo = $('#tempo').val();
  }

  function changeKit(){
    currentKit = $('select#kit').val();
    if(currentKit === 'Drums-of-Death'){
      currentKit = kits[0];
    }
    if(currentKit === 'Earthquake-Ruckus'){
      currentKit = kits[1];
    }
    if(currentKit === 'God-vs-Satan'){
      currentKit = kits[2];
    }
  }


//////// KITS ////////
  var kits = [];
  var kNumInstruments = 3; // called in drawDrumGrid(), drawPlayhead()
  var kitNames = [
    'Drums-of-Death',
    'Earthquake-Ruckus',
    'God-vs-Satan',
  ];
  //------ Initialize Drum Kits ------//
  function initDrums(){
    var numKits = kitNames.length;
    for (var i = 0; i < numKits; i++) {
      kits.push(new Kit(context, kitNames[i], kNumInstruments));
    }
    changeKit();
    console.log(kits);
  }


//////// PLAYBACK and CLOCK ////////
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
  var context;
  var nextNoteTime = 0.0;
  var lap = 25.0;
  var lookAhead = 0.1;
  var sampleRate = 44100.0;
  var nyquist = sampleRate * 0.5;
  var startTime;
  var loopLength = 16;
  var rhythmIndex = 0;
  var loopNumber = 0;
  var lastDrawTime = -1;
  var isPlaying = false;
  var timerID = 0;

  function createAudioContext(){
    context = new webkitAudioContext();
  }

  function play(e){
    isPlaying = !isPlaying;
    if(isPlaying){
      rhythmIndex = 0;
      nextNoteTime = context.currentTime;
      schedule();
      return 'stop';/////switch with toggle
    }else{
      window.clearTimeout(timerID);
      return 'play';//////switch with toggle
    }
    e.preventDefault();
  }

  function schedule(){
    while (nextNoteTime < context.currentTime + lookAhead) {
      if (rhythm1[rhythmIndex] === 1){
        playNote(currentKit.kickBuffer);
      }
      if (rhythm2[rhythmIndex] === 1){
        playNote(currentKit.snareBuffer);
      }
      if (rhythm3[rhythmIndex] === 1){
        playNote(currentKit.hatBuffer);
      }
      // Attempt to synchronize drawing time with sound
      //if (nextNoteTime !== lastDrawTime){
        //lastDrawTime = nextNoteTime;
        //drawPlayhead(rhythmIndex);
      //}
      advanceNote();
    }
    timerID = window.setTimeout(schedule, lap);
  }

  function playNote(buffer){
    console.log(buffer);
    var voice = context.createBufferSource();
    voice.buffer = buffer;
    voice.connect(context.destination);
    voice.start(0);
  }

  function advanceNote() {
    var secondsPerBeat = 60.0/tempo;
    nextNoteTime += 0.25 * secondsPerBeat;

    rhythmIndex++;
    if (rhythmIndex === loopLength) {
      rhythmIndex = 0;
      loopNumber++;
    }
  }

/*
//////// CANVAS and ANIMATION FRAME ////////
  var canvas;
  var canvasContext;

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
  }

  window.requestAnimFrame = (function(){
    return(
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback){
        window.setTimeout(callback, 1000/60);
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
    if (last16thNoteDrawn !== currentNote) {
      var x = Math.floor(canvas.width / 18);
      canvasContext.clearRect(0,0,canvas.width, canvas.height);
      for (var i=0; i<16; i++) {
        canvasContext.fillStyle = (currentNote === i) ?
          ((currentNote%4 === 0)?'red':'blue') : 'black';
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
*/
})();
