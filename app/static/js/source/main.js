(function(){

/*globals  webkitAudioContext: true, Kit:true*/
  'use strict';


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createAudioContext();
    initDrums();
    $('#play').click(play);
    $('#setTempo').click(setTempo);
    $('.kick').click(clickKick);
    $('.snare').click(clickSnare);
    $('.hat').click(clickHat);
    $('.seqStep').click(clickSeqStep);
    $('select#kit').change(changeKit);
  }

//////// KITS ////////
  var kits = [];
  var kNumInstruments = 3; // called in drawDrumGrid(), drawPlayhead()
  var kitNames = [
    'Plasticid-MkII',
    'T09',
    'TR606',
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

//////// CONTROLS ////////
  var currentKit;
  var tempo = 120.0;

  function setTempo(){
    tempo = $('#tempo').val();
  }

  function changeKit(){
    currentKit = $('select#kit').val();
    if(currentKit === 'Plasticid-MkII'){
      currentKit = kits[0];
    }
    if(currentKit === 'T09'){
      currentKit = kits[1];
    }
    if(currentKit === 'TR606'){
      currentKit = kits[2];
    }
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

  function clickSeqStep(){
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
    }else{
      $(this).removeClass('selected');
    }
  }

/////////Web Audio Drums///////////////
  var context;
  var source;

  function createAudioContext(){
    context = new webkitAudioContext();
  }

  /*function createDrums(){
    drums = new BufferLoader(context,
                            ['../../audios/Plasticid-MkII/kick.wav',
                             '../../audios/Plasticid-MkII/snare.wav',
                             '../../audios/Plasticid-MkII/hat.wav'],
                             dummyFunction);
    drums.load();
  }

  function dummyFunction(){
    console.log('maybe');
  }*/


//////////Play///////////////////////

  var current16thNote;
  var nextNoteTime = 0.0;
  var lap = 10.0;
  var lookAhead = 0.1;
  var kickQueue=[];
  var snareQueue=[];
  var hatQueue=[];
  var isPlaying = false;
  var timerID = 0;
  //var nyquist = sampleRate * 0.5;



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
    if(_.contains(kickQueue, beatNumber)){
      if(_.contains(snareQueue, beatNumber)){
        if(_.contains(hatQueue, beatNumber)){
          playNote(currentKit.kickBuffer);
          playNote(currentKit.snareBuffer);
          playNote(currentKit.hatBuffer);
        }else{
          playNote(currentKit.kickBuffer);
          playNote(currentKit.snareBuffer);
        }
      }else{
        playNote(currentKit.kickBuffer);
      }
    }else if(_.contains(snareQueue, beatNumber)){
      if(_.contains(hatQueue, beatNumber)){
        playNote(currentKit.snareBuffer);
        playNote(currentKit.hatBuffer);
      }else{
        playNote(currentKit.snareBuffer);
      }
    }else if(_.contains(hatQueue, beatNumber)){
      playNote(currentKit.hatBuffer);
    }
  }

  function playNote(buffer){
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
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
