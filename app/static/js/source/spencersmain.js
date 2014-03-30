(function(){

/* globals requestAnimationFrame:true, webkitAudioContext:true, Kit:true */
  'use strict';


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createAudioContext();


    $('#play').click(play);
    $('#setTempo').click(setTempo);
    $('select#kit').change(changeKit);
    $('#volume').change(changeVolume);

    $('.kick').click(clickKick);
    $('.snare').click(clickSnare);
    $('.hat').click(clickHat);
    $('.tom1').click(clickTom1);

    $('#kick').click(playKick);
    $('#snare').click(playSnare);
    $('#hat').click(playHat);
    $('#tom1').click(playTom1);
/*
    $('.a').click(clickA);
    $('.b').click(clickB);
    $('.c').click(clickC);
    $('.d').click(clickD);
    $('.e').click(clickE);
    $('.f').click(clickF);
    $('.g').click(clickG);

    $('#a').click(playA);
    $('#b').click(playB);
    $('#c').click(playC);
    $('#d').click(playD);
    $('#e').click(playE);
    $('#f').click(playF);
    $('#g').click(playG);
*/
    $('.seqStep').click(clickSeqStep);

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


//////// KIT PADS ////////
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

/*
//////// SYNTH PADS ////////
  function playA(){
    playNote(currentSynth.aBuffer);
  }

  function playB(){
    playNote(currentSynth.bBuffer);
  }

  function playC(){
    playNote(currentSynth.cBuffer);
  }

  function playD(){
    playNote(currentSynth.dBuffer);
  }

  function playE(){
    playNote(currentSynth.eBuffer);
  }

  function playF(){
    playNote(currentSynth.fBuffer);
  }

  function playG(){
    playNote(currentSynth.gBuffer);
  }
*/

//////// KITS ////////
  var kits = [];
  var kNumInstruments = 3;
  var kitNames = [
    'Plasticid-MkII',
    'T09',
    'TR606',
  ];

  function initDrums(){
    var numKits = kitNames.length;
    for (var i = 0; i < numKits; i++) {
      kits.push(new Kit(context, kitNames[i], kNumInstruments));
    }
    changeKit();
  }

/*
//////// SYNTHS ////////
  var synths = [];
  var sNumInstruments = 3;
  var synthNames = [
    'Plasticid-MkII',
    'T09',
    'TR606',
  ];

  function initSynths(){
    var numSynths = synthNames.length;
    for (var i = 0; i < numSynths; i++) {
      synths.push(new Synth(context, synthNames[i], sNumInstruments));
    }
    changeSynth();
  }
*/

//////// CONTROLS ////////
  var currentKit;
  //var currentSynth;
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
/*
  function changeSynth(){
    currentSynth = $('select#synth').val();
    if(currentSynth === 'Plasticid-MkII'){
      currentSynth = synths[0];
    }
    if(currentSynth === 'T09'){
      currentSynth = synths[1];
    }
    if(currentSynth === 'TR606'){
      currentSynth = synths[2];
    }
  }
*/
  function toggleStop(){
    if ($('#play').text() === 'STOP') {
      $('#play').text('PLAY');
    }else{
      $('#play').text('STOP');
    }
  }

  function changeVolume(){
    var volume = $('#volume').attr('data-slider');
    gainVolume = volume/50;
  }

  function clickSeqStep(){
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
    }else{
      $(this).removeClass('selected');
    }
  }


//////// KIT SEQUENCER ////////
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

/*
//////// SYNTH SEQUENCER ////////
  var aQueue=[];
  var bQueue=[];
  var cQueue=[];
  var dQueue=[];
  var eQueue=[];
  var fQueue=[];
  var gQueue=[];

  function clickA(){
    if(!$(this).hasClass('selected')){
      aQueue.push(parseInt($(this).attr('a-sequence-position')));
    }else{
      aQueue = _.without(aQueue, parseInt($(this).attr('a-sequence-position')));
    }
  }

  function clickB(){
    if(!$(this).hasClass('selected')){
      bQueue.push(parseInt($(this).attr('b-sequence-position')));
    }else{
      bQueue = _.without(bQueue, parseInt($(this).attr('b-sequence-position')));
    }
  }

  function clickC(){
    if(!$(this).hasClass('selected')){
      cQueue.push(parseInt($(this).attr('c-sequence-position')));
    }else{
      cQueue = _.without(cQueue, parseInt($(this).attr('c-sequence-position')));
    }
  }

  function clickD(){
    if(!$(this).hasClass('selected')){
      dQueue.push(parseInt($(this).attr('d-sequence-position')));
    }else{
      dQueue = _.without(dQueue, parseInt($(this).attr('d-sequence-position')));
    }
  }

  function clickE(){
    if(!$(this).hasClass('selected')){
      eQueue.push(parseInt($(this).attr('e-sequence-position')));
    }else{
      eQueue = _.without(eQueue, parseInt($(this).attr('e-sequence-position')));
    }
  }

  function clickF(){
    if(!$(this).hasClass('selected')){
      fQueue.push(parseInt($(this).attr('f-sequence-position')));
    }else{
      fQueue = _.without(fQueue, parseInt($(this).attr('f-sequence-position')));
    }
  }

  function clickG(){
    if(!$(this).hasClass('selected')){
      gQueue.push(parseInt($(this).attr('g-sequence-position')));
    }else{
      gQueue = _.without(gQueue, parseInt($(this).attr('g-sequence-position')));
    }
  }
*/

//////// PLAYBACK ////////
  var current16thNote;
  var nextNoteTime = 0.0;
  var lap = 10.0;
  var lookAhead = 0.1;
  var isPlaying = false;
  var timerID = 0;
  var source;
  //var nyquist = sampleRate * 0.5;
  var context;

  function createAudioContext(){
    context = new webkitAudioContext();
  }

  function play(){
    isPlaying = !isPlaying;
    if(isPlaying){
      current16thNote = 0;
      nextNoteTime = context.currentTime;
      scheduler();
      toggleStop();
    }else{
      window.clearTimeout(timerID);
      toggleStop();
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
    notesInQueue.push({note:beatNumber, time:time});
    if(_.contains(kickQueue, beatNumber)){
      playNote(currentKit.kickBuffer);
    }
    if(_.contains(snareQueue, beatNumber)){
      playNote(currentKit.snareBuffer);
    }
    if(_.contains(hatQueue, beatNumber)){
      playNote(currentKit.hatBuffer);
    }
    if(_.contains(tom1Queue, beatNumber)){
      playNote(currentKit.tom1Buffer);
    }
    /*if(_.contains(aQueue, beatNumber)){
      playNote(currentSynth.aBuffer);
    }
    if(_.contains(bQueue, beatNumber)){
      playNote(currentSynth.bBuffer);
    }
    if(_.contains(cQueue, beatNumber)){
      playNote(currentSynth.cBuffer);
    }
    if(_.contains(dQueue, beatNumber)){
      playNote(currentSynth.dBuffer);
    }
    if(_.contains(eQueue, beatNumber)){
      playNote(currentSynth.eBuffer);
    }
    if(_.contains(fQueue, beatNumber)){
      playNote(currentSynth.fBuffer);
    }
    if(_.contains(gQueue, beatNumber)){
      playNote(currentSynth.gBuffer);
    }*/
  }
/*
  function scheduleNote(beatNumber, time){
    notesInQueue.push({note:beatNumber, time:time});
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
*/
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

  //////// CANVAS and ANIMATION FRAME ////////
  var canvas = document.getElementById('animation');
  var canvas2 = document.getElementById('animation2');
  var canvasContext;
  var canvas2Context;
  //var anim;
  //var wrapper = $('#sequenceWrapper').width();
  var last16thNoteDrawn = -1;
  var notesInQueue = [];

  function initCanvas(){
    //canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas2Context = canvas2.getContext( '2d' );
    canvas.width = 967;
    canvas.height = 20;
    canvas2.width = 967;
    canvas2.height = 20;
    //anim = document.getElementById('animation');
    //anim.appendChild(canvas);
    //canvasContext.strokeStyle = '#ff0000';
    //canvasContext.lineWidth = 2;
    //var x = Math.floor(canvas.width / 18);
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    canvas2Context.clearRect(0,0,canvas.width, canvas.height);
    for (var i=0; i<16; i++){
      if(i === 0){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(69, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(69, 0, 30, 15);
      }else if (i === 1){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(121, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(121, 0, 30, 15);
      }else if (i === 2){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(173, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(173, 0, 30, 15);
      }else if (i === 3){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(225, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(225, 0, 30, 15);
      }else if (i === 4){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(302, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(302, 0, 30, 15);
      }else if (i === 5){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(354, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(354, 0, 30, 15);
      }else if (i === 6){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(406, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(406, 0, 30, 15);
      }else if (i === 7){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(458, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(458, 0, 30, 15);
      }else if (i === 8){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(535, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(535, 0, 30, 15);
      }else if (i === 9){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(587, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(587, 0, 30, 15);
      }else if (i === 10){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(639, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(639, 0, 30, 15);
      }else if (i === 11){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(691, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(691, 0, 30, 15);
      }else if (i === 12){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(768, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(768, 0, 30, 15);
      }else if (i === 13){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(820, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(820, 0, 30, 15);
      }else if (i === 14){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(872, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(872, 0, 30, 15);
      }else{
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(924, 0, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(924, 0, 30, 15);
      }
    }
  }

  function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = context.currentTime;
    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
      currentNote = notesInQueue[0].note;
      notesInQueue.splice(0,1);
    }
    if (last16thNoteDrawn !== currentNote) {
      //var x = Math.floor(canvas.width / 18);
      canvasContext.clearRect(0,0,canvas.width, canvas.height);
      canvas2Context.clearRect(0,0,canvas.width, canvas.height);
      for (var i=0; i<16; i++){
        if(i === 0){
          canvasContext.fillStyle = (currentNote === i+15) ? 'yellow' : 'navy';
          canvasContext.fillRect(69, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i+15) ? 'yellow' : 'navy';
          canvas2Context.fillRect(69, 0, 30, 15);
        }else if (i === 1){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(121, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(121, 0, 30, 15);
        }else if (i === 2){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(173, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(173, 0, 30, 15);
        }else if (i === 3){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(225, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(225, 0, 30, 15);
        }else if (i === 4){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(302, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(302, 0, 30, 15);
        }else if (i === 5){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(354, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(354, 0, 30, 15);
        }else if (i === 6){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(406, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(406, 0, 30, 15);
        }else if (i === 7){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(458, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(458, 0, 30, 15);
        }else if (i === 8){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(535, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(535, 0, 30, 15);
        }else if (i === 9){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(587, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(587, 0, 30, 15);
        }else if (i === 10){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(639, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(639, 0, 30, 15);
        }else if (i === 11){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(691, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(691, 0, 30, 15);
        }else if (i === 12){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(768, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(768, 0, 30, 15);
        }else if (i === 13){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(820, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(820, 0, 30, 15);
        }else if (i === 14){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(872, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(872, 0, 30, 15);
        }else{
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(924, 0, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(924, 0, 30, 15);
        }
        //canvasContext.fillStyle = (currentNote === i) ? 'yellow' : 'navy';
        //canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
      }
      last16thNoteDrawn = currentNote;
    }
    requestAnimationFrame(draw);
  }

  function resetCanvas(e){
    canvas.width = window.innerWidth;
    canvas.height = 100;
    //wrapper.width = window.innerWidth;
    $('#sequenceWrapper').width($(window).width());
    //wrapper.height = window.innerHeight;
    window.scrollTo(0,0);
  }

})();
