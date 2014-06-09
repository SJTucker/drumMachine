(function(){

/*globals  requestAnimationFrame:true, webkitAudioContext: true, Kit:true*/
  'use strict';


  $(document).ready(init);

  function init(){
    $(document).foundation();
    createAudioContext();
    initDrums();
    initSynths();
    initDrums();
    initCanvas();
    requestAnimationFrame(draw);

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    $('#play').click(play);
    $('#play').text('PLAY');
    $('#setTempo').click(setTempo);
    $('#clear').click(clear);

    $('.kick').click(clickKick);
    $('.snare').click(clickSnare);
    $('.hat').click(clickHat);
    $('.tom').click(clickTom);
    $('.ohat').click(clickOhat);
    $('select#synth').change(changeSynth);

    $('select#kit').change(changeKit);
    $('#kitVolume').change(changeKitVolume);
    $('#synthVolume').change(changeSynthVolume);


    $('#kick').click(playKick);
    $('#snare').click(playSnare);
    $('#hat').click(playHat);
    $('#tom').click(playTom);
    $('#ohat').click(playOhat);

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
    $('.seqStep').click(clickSeqStep);

//////Pads CSS////////////////
    $('body').keydown(function(event){
      if(event.keyCode === 16 || event.keyCode === 90){
        playKick();
        $('#kick').css('background-color', 'white');
        $('#kick').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 16 || event.keyCode === 90){
        $('#kick').css('background-color', 'black');
        $('#kick').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 18){
        playSnare();
        $('#snare').css('background-color', 'white');
        $('#snare').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 18){
        $('#snare').css('background-color', 'black');
        $('#snare').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 91){
        playHat();
        $('#hat').css('background-color', 'white');
        $('#hat').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 91){
        $('#hat').css('background-color', 'black');
        $('#hat').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 82 || e.keyCode === 84){
        playTom();
        $('#tom').css('background-color', 'white');
        $('#tom').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 82 || event.keyCode === 84){
        $('#tom').css('background-color', 'black');
        $('#tom').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 81){
        playOhat();
        $('#ohat').css('background-color', 'white');
        $('#ohat').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 81){
        $('#ohat').css('background-color', 'black');
        $('#ohat').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 221){
        playF();
        $('#f').css('background-color', 'white');
        $('#f').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 221){
        $('#f').css('background-color', 'black');
        $('#f').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 220){
        playG();
        $('#g').css('background-color', 'white');
        $('#g').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 220){
        $('#g').css('background-color', 'black');
        $('#g').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 219){
        playD();
        $('#d').css('background-color', 'white');
        $('#d').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 219){
        $('#d').css('background-color', 'black');
        $('#d').css('color', 'white');
      }
    });
    $('body').keydown(function(e){
      if(e.keyCode === 80){
        playC();
        $('#c').css('background-color', 'white');
        $('#c').css('color', 'black');
      }
    });
    $('body').keyup(function(event){
      if(event.keyCode === 80){
        $('#c').css('background-color', 'black');
        $('#c').css('color', 'white');
      }
    });
    $('#save').click(saveBeat);
    $('#load').click(getBeat);
  }
///////Play Drum Pads//////////////
  function playKick(){
    playNote(currentKit.kickBuffer);
  }

  function playSnare(){
    playNote(currentKit.snareBuffer);
  }

  function playHat(){
    playNote(currentKit.hatBuffer);
  }

  function playTom(){
    playNote(currentKit.tomBuffer);
  }

  function playOhat(){
    playNote(currentKit.ohatBuffer);
  }

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
//////// KITS ////////
  var kits = [];
  var kNumInstruments = 9; // called in drawDrumGrid(), drawPlayhead()
  var kitNames = [
    'Plasticid-MkII',
    'T09',
    'TR606',
    'hiphop',
    'dr.groove',
    'ace',
    'akai-xe-8',
    'nord-rack-2',
    'groovebox'


  ];

 //------ Initialize Drum Kits ------//
  function initDrums(){
    var numKits = kitNames.length;
    for (var i = 0; i < numKits; i++) {
      kits.push(new Kit(context, kitNames[i], kNumInstruments));
    }
    changeKit();
  }

//////// Initialize Synths ////////
  var synths = [];
  var sNumInstruments = 4;
  var synthNames = [
    'MiniSquare',
    'FattySaw',
    'TriSaw',
    'SweetChords'
  ];

  function initSynths(){
    var numSynths = synthNames.length;
    for (var i = 0; i < numSynths; i++) {
      synths.push(new Synth(context, synthNames[i], sNumInstruments));
    }
    changeSynth();
  }

//////// CONTROLS ////////
  var currentKit;
  var currentSynth;
  var tempo = 120.0;
  var gainKitVolume = 1.0;
  var gainSynthVolume = 1.0;

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
    if(currentKit === 'hiphop'){
      currentKit = kits[3];
    }
    if(currentKit === 'dr.groove'){
      currentKit = kits[4];
    }
    if(currentKit === 'ace'){
      currentKit = kits[5];
    }
    if(currentKit === 'akai-xe-8'){
     currentKit = kits[6];
    }
    if(currentKit === 'nord-rack-2'){
      currentKit = kits[7];
    }
    if(currentKit === 'groovebox'){
      currentKit = kits[8];
    }
  }

  function changeSynth(){
    currentSynth = $('select#synth').val();
    if(currentSynth === 'MiniSquare'){
      currentSynth = synths[0];
    }
    if(currentSynth === 'FattySaw'){
      currentSynth = synths[1];
    }
    if(currentSynth === 'TriSaw'){
      currentSynth = synths[2];
    }
    if(currentSynth === 'SweetChords'){
      currentSynth = synths[3];
    }
  }

  function toggleStop(){
    if ($('#play').text() === 'STOP') {
      $('#play').text('PLAY');
    }else{
      $('#play').text('STOP');
    }
  }

  function changeKitVolume(){
    var volume = $('#kitVolume').attr('data-slider');
    gainKitVolume = volume/50;
    console.log($('#kitVolume').attr('data-slider'));
  }

  function changeSynthVolume(){
    var volume = $('#synthVolume').attr('data-slider');
    gainSynthVolume = volume/50;
  }

  function clickSeqStep(){
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
    }else{
      $(this).removeClass('selected');
    }
  }
//////////Kit Sequencer//////////////
  var kickQueue=[];
  var snareQueue=[];
  var hatQueue=[];
  var tomQueue=[];
  var ohatQueue=[];

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

  function clickTom(){
    if(!$(this).hasClass('selected')){
      tomQueue.push(parseInt($(this).attr('tom-sequence-position')));
    }else{
      tomQueue = _.without(tomQueue, parseInt($(this).attr('tom-sequence-position')));
    }
  }

  function clickOhat(){
    if(!$(this).hasClass('selected')){
      ohatQueue.push(parseInt($(this).attr('ohat-sequence-position')));
    }else{
      ohatQueue = _.without(ohatQueue, parseInt($(this).attr('ohat-sequence-position')));
    }
  }


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
    if(_.contains(tomQueue, beatNumber)){
      playNote(currentKit.tomBuffer);
    }
    if(_.contains(ohatQueue, beatNumber)){
      playNote(currentKit.ohatBuffer);
    }
    if(_.contains(aQueue, beatNumber)){
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
    }
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

  function randomColor(buffer){
    if(buffer === currentKit.kickBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      $('#kick').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentKit.snareBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#snare').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentKit.hatBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#hat').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentKit.tomBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#tom').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentKit.ohatBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#ohat').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.aBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#a').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.bBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#b').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.cBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#c').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.dBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#d').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.eBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#e').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.fBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#f').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
    else if(buffer === currentSynth.gBuffer){
      var red = Math.floor(Math.random() * 256);
      var grn = Math.floor(Math.random() * 256);
      var blu = Math.floor(Math.random() * 256);
      var alp = Math.random();
      $('#g').css('background-color', 'rgb('+red+', '+grn+', '+blu+')');
    }
  }


  function playNote(buffer){
    randomColor(buffer);

    if(buffer === currentKit.kickBuffer || buffer === currentKit.snareBuffer || buffer === currentKit.hatBuffer || buffer === currentKit.tomBuffer || buffer == currentKit.ohatBuffer){
      var gainNode = context.createGain();
      gainNode.gain.value = gainKitVolume;
    }else{
      var gainNode = context.createGain();
      gainNode.gain.value = gainSynthVolume;
    }

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

  function clear(){
    $('.seqStep').removeClass('selected');
    kickQueue = [];
    snareQueue = [];
    hatQueue = [];
    tomQueue = [];
    ohatQueue= [];
    aQueue= [];
    bQueue= [];
    cQueue= [];
    dQueue= [];
    eQueue= [];
    fQueue= [];
    gQueue= [];

  }

/////////////User///////////////
  var beats = [];
  var name;
  function saveBeat(){
    var url = window.location.origin;
    name = $('#name').val();
    var data = {name:name,
                kickQueue:kickQueue,
                snareQueue:snareQueue,
                hatQueue:hatQueue,
                tomQueue:tomQueue,
                ohatQueue:ohatQueue,
                aQueue:aQueue,
                bQueue:bQueue,
                cQueue:cQueue,
                dQueue:dQueue,
                eQueue:eQueue,
                fQueue:fQueue,
                gQueue:gQueue};
    var type = 'POST';
    var success = updateBeats;

    $.ajax({data:data, url:url, type:type, success:success});

    event.preventDefault();
  }

  function updateBeats(){
    var $option;
    beats.push({name:name,
                kickQueue:kickQueue,
                snareQueue:snareQueue,
                hatQueue:hatQueue,
                tomQueue:tomQueue,
                ohatQueue:ohatQueue,
                aQueue:aQueue,
                bQueue:bQueue,
                cQueue:cQueue,
                dQueue:dQueue,
                eQueue:eQueue,
                fQueue:fQueue,
                gQueue:gQueue});
    console.log(beats[beats.length-1].name);

    $option = $('<option value="'+beats[beats.length-1].name+'">'+beats[beats.length-1].name+'</option>');
    $('#beats').prepend($option);

  }

  function getBeat(){
    kickQueue = [];
    snareQueue = [];
    hatQueue = [];
    tomQueue = [];
    ohatQueue= [];
    aQueue= [];
    bQueue= [];
    cQueue= [];
    dQueue= [];
    eQueue= [];
    fQueue= [];
    gQueue= [];

    console.log(kickQueue);
    $('.seqStep').removeClass('selected');
    console.log($('#beats').val());
    var url = window.location.origin+'/user/'+$('#beats').val();
    $.getJSON(url, loadBeat);
  }

  function loadBeat(data){
    console.log(data);
    kickQueue = data.beat.kickQueue;
    snareQueue = data.beat.snareQueue;
    hatQueue = data.beat.hatQueue;
    tomQueue = data.beat.tomQueue;
    ohatQueue = data.beat.ohatQueue;

    aQueue = data.beat.aQueue;
    bQueue = data.beat.bQueue;
    cQueue = data.beat.cQueue;
    dQueue = data.beat.dQueue;
    eQueue = data.beat.eQueue;
    fQueue = data.beat.fQueue;
    gQueue = data.beat.gQueue;

    console.log(kickQueue);



//////////NEEEEEEEDS WORK////////////
    for(var i = 0; i < 16; i++){
      if(_.contains(kickQueue, i)){
        $('ul.kickUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(snareQueue, i)){
        $('ul.snareUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(hatQueue, i)){
        $('ul.hatUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(tomQueue, i)){
        $('ul.tomUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(ohatQueue, i)){
        $('ul.ohatUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(aQueue, i)){
        $('ul.aUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(bQueue, i)){
        $('ul.bUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(cQueue, i)){
        $('ul.cUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(dQueue, i)){
        $('ul.dUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(eQueue, i)){
        $('ul.eUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(fQueue, i)){
        $('ul.fUL li:eq('+(i+1)+')').addClass('selected');
      }
      if(_.contains(gQueue, i)){
        $('ul.gUL li:eq('+(i+1)+')').addClass('selected');
      }
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
        canvasContext.fillRect(69, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(69, 1, 30, 15);
        canvasContext.strokeStyle='black';
        canvasContext.strokeRect(68, 0, 32, 17);
        canvas2Context.strokeStyle='black';
        canvas2Context.strokeRect(68, 0, 32, 17);
      }else if (i === 1){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(121, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(121, 1, 30, 15);
        canvasContext.strokeStyle='black';
        canvasContext.strokeRect(120, 0, 32, 17);
        canvas2Context.strokeStyle='black';
        canvas2Context.strokeRect(120, 0, 32, 17);
      }else if (i === 2){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(173, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(173, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(172, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(172, 0, 32, 17);
      }else if (i === 3){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(225, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(225, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(224, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(224, 0, 32, 17);
      }else if (i === 4){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(302, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(302, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(301, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(301, 0, 32, 17);
      }else if (i === 5){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(354, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(354, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(353, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(353, 0, 32, 17);
      }else if (i === 6){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(406, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(406, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(405, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(405, 0, 32, 17);
      }else if (i === 7){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(458, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(458, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(457, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(457, 0, 32, 17);
      }else if (i === 8){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(535, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(535, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(534, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(534, 0, 32, 17);
      }else if (i === 9){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(587, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(587, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(586, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(586, 0, 32, 17);
      }else if (i === 10){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(639, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(639, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(638, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(638, 0, 32, 17);
      }else if (i === 11){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(691, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(691, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(690, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(690, 0, 32, 17);
      }else if (i === 12){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(768, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(768, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(767, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(767, 0, 32, 17);
      }else if (i === 13){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(820, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(820, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(819, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(819, 0, 32, 17);
      }else if (i === 14){
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(872, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(872, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(871, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(871, 0, 32, 17);
      }else{
        canvasContext.fillStyle = 'navy';
        canvasContext.fillRect(924, 1, 30, 15);
        canvas2Context.fillStyle = 'navy';
        canvas2Context.fillRect(924, 1, 30, 15);
        canvasContext.strokeStyle='#000000';
        canvasContext.strokeRect(923, 0, 32, 17);
        canvas2Context.strokeStyle='#000000';
        canvas2Context.strokeRect(923, 0, 32, 17);
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
          canvasContext.fillRect(69, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i+15) ? 'yellow' : 'navy';
          canvas2Context.fillRect(69, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(68, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(68, 0, 32, 17);
        }else if (i === 1){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(121, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(121, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(120, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(120, 0, 32, 17);
        }else if (i === 2){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(173, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(173, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(172, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(172, 0, 32, 17);
        }else if (i === 3){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(225, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(225, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(224, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(224, 0, 32, 17);
        }else if (i === 4){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(302, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(302, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(301, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(301, 0, 32, 17);
        }else if (i === 5){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(354, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(354, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(353, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(353, 0, 32, 17);
        }else if (i === 6){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(406, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(406, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(405, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(405, 0, 32, 17);
        }else if (i === 7){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(458, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(458, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(457, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(457, 0, 32, 17);
        }else if (i === 8){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(535, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(535, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(534, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(534, 0, 32, 17);
        }else if (i === 9){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(587, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(587, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(586, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(586, 0, 32, 17);
        }else if (i === 10){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(639, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(639, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(638, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(638, 0, 32, 17);
        }else if (i === 11){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(691, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(691, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(690, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(690, 0, 32, 17);
        }else if (i === 12){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(768, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(768, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(767, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(767, 0, 32, 17);
        }else if (i === 13){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(820, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(820, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(819, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(819, 0, 32, 17);
        }else if (i === 14){
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(872, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(872, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(871, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(871, 0, 32, 17);
        }else{
          canvasContext.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvasContext.fillRect(924, 1, 30, 15);
          canvas2Context.fillStyle = (currentNote === i-1) ? 'yellow' : 'navy';
          canvas2Context.fillRect(924, 1, 30, 15);
          canvasContext.strokeStyle='#000000';
          canvasContext.strokeRect(923, 0, 32, 17);
          canvas2Context.strokeStyle='#000000';
          canvas2Context.strokeRect(923, 0, 32, 17);
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
