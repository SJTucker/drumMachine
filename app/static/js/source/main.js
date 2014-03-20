(function(){

  'use strict';
  var context;
  var drums;


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createContext();
    //createSound();
    createDrums();
    $('#kick').click(playKick);
    $('#snare').click(playSnare);
    $('#hat').click(playHat);
    $('body').keydown(function(event){
      if(event.keyCode === 65 || event.keyCode === 90){
        playKick();
        $('#kick').css('background-color', 'white');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 65 || event.keyCode === 90){
        $('#kick').css('background-color', 'black');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 72){
        playSnare();
        $('#snare').css('background-color', 'white');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 72){
        $('#snare').css('background-color', 'black');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 76){
        playHat();
        $('#hat').css('background-color', 'white');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 76){
        $('#hat').css('background-color', 'black');
      }
    });
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

  function createDrums(){
    drums = new BufferLoader(context, ['../../audios/drums/kick.wav', '../../audios/drums/snare.wav', '../../audios/drums/hat.wav'], playKick);
    drums.load();
  }

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


})();
