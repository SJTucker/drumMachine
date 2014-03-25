(function(){

/*globals BufferLoader: true, webkitAudioContext: true*/
  'use strict';

  var context;
  var drums;
  var current16thNote;
  var nextNoteTime = 0.0;
  var lap = 10.0;
  var lookAhead = 0.1;
  var tempo = 120.0;
  var isPlaying = false;
  //var noteLength = 0.05;
  var timerID = 0;
  var source;
  var kickQueue=[];
  var snareQueue=[];
  var hatQueue=[];

  $(document).ready(init);

  function init(){
    $(document).foundation();
    createAudioContext();
    createDrums();
    $('#play').click(play);
    $('#setTempo').click(setTempo);
    $('.kick').click(clickKick);
    $('.snare').click(clickSnare);
    $('.hat').click(clickHat);
    $('.seqStep').click(clickSeqStep);
  }

//////////Sequencer//////////////

  function clickKick(){
    if(!$(this).hasClass('selected')){
      kickQueue.push(parseInt($(this).attr('kick-sequence-position')));
    }else{
      kickQueue = _.without(kickQueue, parseInt($(this).attr('kick-sequence-position')));
    }
  }

  function clickSnare(){
    if(!$(this).hasClass('selected')){
      snareQueue.push(parseInt($(this).attr('snare-sequence-position')));
    }else{
      snareQueue = _.without(snareQueue, parseInt($(this).attr('snare-sequence-position')));
    }
  }
  
  function clickHat(){
    if(!$(this).hasClass('selected')){
      hatQueue.push(parseInt($(this).attr('hat-sequence-position')));
    }else{
      hatQueue = _.without(hatQueue, parseInt($(this).attr('hat-sequence-position')));
    }
  }
///////////Setup////////////
  function setTempo(){
    tempo = $('#tempo').val();
  }

  function clickSeqStep(){
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
    }else{
      $(this).removeClass('selected');
    }
  }

/////////Web Audio Drums///////////////
  function createAudioContext(){
    context = new webkitAudioContext();
  }

  function createDrums(){
    drums = new BufferLoader(context,
                            ['../../audios/TR606/BassDrum.wav',
                             '../../audios/TR606/Snare.wav',
                             '../../audios/TR606/ClosedHat.wav'],
                             dummyFunction);
    drums.load();
  }

  function dummyFunction(){
    console.log('maybe');
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

    /*if(beatNumber % 16 === 0){
      playKick();
    }else if(beatNumber % 4){
      playHat();
    }else{
      playSnare();
    }*/

    if(_.contains(kickQueue, beatNumber)){
      if(_.contains(snareQueue, beatNumber)){
        if(_.contains(hatQueue, beatNumber)){
          playKick();
          playSnare();
          playHat();
        }else{
          playKick();
          playSnare();
        }
      }else{
        playKick();
      }
    }else if(_.contains(snareQueue, beatNumber)){
      if(_.contains(hatQueue, beatNumber)){
        playSnare();
        playHat();
      }else{
        playSnare();
      }
    }else if(_.contains(hatQueue, beatNumber)){
      playHat();
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
