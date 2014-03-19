(function(){

  'use strict';
  var context;
  var bufferLoader;
  var hat, kick, snare;

  window.addEventListener('load', init, false);

  $(document).ready(init);

  function init(){
    $(document).foundation();
    createContext();
    createDrums();
   // createBufferLoader();


    $('#kick').click(createKick);
    $('#snare').click(snare);
    $('#hat').click(hat);
   // $('#stop').click(stopOscillator);
  }

  ///////////////BABY STEPS//////////////


  
 /* function createBufferLoader(){
    //bufferLoader = new BufferLoader(context, ['http://www.villagegeek.com/downloads/webwavs/adios.wav'], finishedLoading);
    bufferLoader = new BufferLoader(context, ['../../audios/adios.wav'], finishedLoading);
    bufferLoader.load();
  }

  function finishedLoading(bufferList){
    var source = context.createBufferSource();
    source.buffer = bufferList[0];

    source.connect(context.destination);
    source.start(0);
  }

  function createContext(){///setting up audio context
    try{
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new webkitAudioContext();
    }catch(e){
      alert('Web Audio API is not supported by this browser');
    }
  }

  function playOscillator(){
    var source = context.createOscillator();
    source.type = 1;
    source.connect(context.destination);
    source.start(0);
  }

  function stopOscillator(){
    source.stop(0);
  }*/


///////STEP: SIMPLE DRUMS/////////////////
  
  function createContext(){///setting up audio context
    try{
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new webkitAudioContext();
    }catch(e){
      alert('Web Audio API is not supported by this browser');
    }
  }


  function createDrums(){
    var drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], playBeat);
    drums.load();
  }


  function playBeat(bufferList){
    var startTime = context.currentTime + 0.2000;
    var tempo = 80;
    var eightNoteTime = (60/tempo)/2;
    for (var bar = 0; bar < 8; bar++){
      var time = startTime + bar * 8 * eightNoteTime;
      playSound(bufferList[0], time);
      playSound(bufferList[0], time + 4 * eightNoteTime);
      
      playSound(bufferList[1], time + 2 * eightNoteTime);
      playSound(bufferList[1], time + 6 * eightNoteTime);
    
      for (var i = 0; i < 16; i++){
        for(var j = 0; j < 8; j++){
          playSound(bufferList[2], time + i * (eightNoteTime/8));
        }
        playSound(bufferList[2], time + i * (eightNoteTime/2));
      }
    }
  }


  function playSound(buffer, time){
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
    
  }
  
  function finishedLoading(bufferList){
    kick = context.createBufferSource();
    snare = context.createBufferSource();
    hat = context.createBufferSource();
    kick.buffer = bufferList[0];
    snare.buffer = bufferList[1];
    hat.buffer = bufferList[2];

    kick.connect(context.destination);
    snare.connect(context.destination);
    hat.connect(context.destination);
  }

   // var drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], playBeat);
   // drums.load();
  
  function createKick(){
    var kick = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], kick);
    kick.load();
  }

  function kick(bufferList){
    kick = context.createBufferSource();
    kick.buffer = bufferList[0];
    kick.connect(context.destination);
  }

  function snare(){
    snare.start(0);
  }

  function hat(){
    hat.start(0);
  }

})();
