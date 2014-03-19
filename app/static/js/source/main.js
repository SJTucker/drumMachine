(function(){

  'use strict';
  var context;


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createContext();
    //createSound();
    
    $('#kick').click(createKick);
  }

  function createContext(){
    try{
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new webkitAudioContext();
    }catch(e){
      alert('Web Audio API is not supported by this browser');
    }
  }

  function createSound(){
    var drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], playBeat);
    drums.load();
  }

  function playBeat(bufferList){
    var kick = bufferList[0];
    var snare = bufferList[1];
    var hat = bufferList[2];
    var startTime = context.currentTime + .100;
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
  }

  function playSound(buffer, time){
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }

  function createKick(){
    var kick = new BufferLoader(context, ['../../audios/drums/kick.wav'], playKick);
    kick.load();
  }

  function playKick(bufferList){
    //var kick = bufferList[0];
    var source = context.createBufferSource();
    source.buffer = bufferList[0];
    source.connect(context.destination);
    source.start(0);
  }


})();
