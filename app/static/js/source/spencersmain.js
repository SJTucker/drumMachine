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
        ctx.strokeRect(20,20,150,100);
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
