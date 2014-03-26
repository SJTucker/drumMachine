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
    $('.tom1').click(clickTom1);
    $('.seqStep').click(clickSeqStep);
    $('select#kit').change(changeKit);
    $('#volume').change(changeVolume);
    $('#kick').click(playKick);
    $('#snare').click(playSnare);
    $('#hat').click(playHat);
    $('#tom1').click(playTom1);
    $('body').keydown(function(event){
      if(event.keyCode === 65 || event.keyCode === 90){
        playKick();
        $('#kick').css('background-color', 'white');
        $('#kick').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 65 || event.keyCode === 90){
        $('#kick').css('background-color', 'black');
        $('#kick').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 72){
        playSnare();
        $('#snare').css('background-color', 'white');
        $('#snare').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 72){
        $('#snare').css('background-color', 'black');
        $('#snare').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 76){
        playHat();
        $('#hat').css('background-color', 'white');
        $('#hat').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 76){
        $('#hat').css('background-color', 'black');
        $('#hat').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 82 || e.keyCode === 84){
        playTom1();
        $('#tom1').css('background-color', 'white');
        $('#tom1').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 82 || event.keyCode === 84){
        $('#tom1').css('background-color', 'black');
        $('#tom1').css('color', 'white');
      }
    });
  }

  function playKick(){
    playNote(currentKit.kickBuffer);
  }

  function playSnare(){
    playNote(currentKit.snareBuffer);
  }

  function playHat(){
    playNote(currentKit.hatBuffer);
  }

  function playTom1(){
    playNote(currentKit.tom1Buffer);
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
  }

//////// CONTROLS ////////
  var currentKit;
  var tempo = 120.0;
  var gainVolume = 1.0;

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

  function changeVolume(){
    var volume = $('#volume').attr('data-slider');
    gainVolume = volume/50;
  }
//////////Sequencer//////////////
  var kickQueue=[];
  var snareQueue=[];
  var hatQueue=[];
  var tom1Queue=[];

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

  function clickTom1(){
    if(!$(this).hasClass('selected')){
      tom1Queue.push(parseInt($(this).attr('tom1-sequence-position')));
    }else{
      tom1Queue = _.without(tom1Queue, parseInt($(this).attr('tom1-sequence-position')));
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

  function createAudioContext(){
    context = new webkitAudioContext();
  }


//////////Play///////////////////////

  var current16thNote;
  var nextNoteTime = 0.0;
  var lap = 10.0;
  var lookAhead = 0.1;
  var isPlaying = false;
  var timerID = 0;
  var source;
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

  function scheduleNote(beatNumber){
    if(_.contains(kickQueue, beatNumber)){
      if(_.contains(snareQueue, beatNumber)){
        if(_.contains(hatQueue, beatNumber)){
          if(_.contains(tom1Queue, beatNumber)){
            playNote(currentKit.kickBuffer);
            playNote(currentKit.snareBuffer);
            playNote(currentKit.hatBuffer);
            playNote(currentKit.tom1Buffer);
          }
          else{
            playNote(currentKit.kickBuffer);
            playNote(currentKit.snareBuffer);
            playNote(currentKit.hatBuffer);
          }
        }
        else{
          playNote(currentKit.kickBuffer);
          playNote(currentKit.snareBuffer);
        }
      }
      else{
        playNote(currentKit.kickBuffer);
      }
    }else if(_.contains(snareQueue, beatNumber)){
      if(_.contains(hatQueue, beatNumber)){
        if(_.contains(tom1Queue, beatNumber)){
          playNote(currentKit.snareBuffer);
          playNote(currentKit.hatBuffer);
          playNote(currentKit.tom1Buffer);
        }else{
          playNote(currentKit.snareBuffer);
          playNote(currentKit.hatBuffer);
        }
      }else{
        playNote(currentKit.snareBuffer);
      }
    }else if(_.contains(hatQueue, beatNumber)){
      if(_.contains(tom1Queue, beatNumber)){
        playNote(currentKit.hatBuffer);
        playNote(currentKit.tom1Buffer);
      }
      else{
        playNote(currentKit.hatBuffer);
      }
    }else if(_.contains(tom1Queue, beatNumber)){
      playNote(currentKit.tom1Buffer);
    }
    
  }

  function playNote(buffer){
    var gainNode = context.createGain();
    gainNode.gain.value = gainVolume;
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
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
