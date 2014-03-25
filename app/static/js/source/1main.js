(function(){

  'use strict';

///////////Globals////////////
  var context;
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

////////////Document Initialize/////////////
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

///////////Setup////////////
  function setTempo(){
    tempo = $('#tempo').val();
  }

//////////Canvas and Animation Frame////////////
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

/////////Web Audio Drums///////////////
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

//////////Play///////////////////////
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

  function nextNote(){
    var secondsPerBeat = 60.0/tempo;
    nextNoteTime += 0.25 * secondsPerBeat;
    current16thNote++;
    if(current16thNote === 16){
      current16thNote = 0;
    }
  }


})();
