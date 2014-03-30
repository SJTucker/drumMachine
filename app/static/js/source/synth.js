'use strict';

var synthCount = 0;
var errorCount = 0;
var successCount = 0;
var synths = 3;

//------ Kit Constructor ------//
function Synth(context, name, sNum) {
  this.context = context;
  this.name = name;
  this.pathName = '../../audios/' + this.name + '/';
  //var pathName = this.pathName();
  var aPath = this.pathName + 'a.wav';
  var bPath = this.pathName + 'b.wav';
  var cPath = this.pathName + 'c.wav';
  var dPath = this.pathName + 'd.wav';
  var ePath = this.pathName + 'e.wav';
  var fPath = this.pathName + 'f.wav';
  var gPath = this.pathName + 'g.wav';

  this.aBuffer = 0;
  this.bBuffer = 0;
  this.cbuffer = 0;
  this.dBuffer = 0;
  this.eBuffer = 0;
  this.fbuffer = 0;
  this.gBuffer = 0;

  this.instrumentCount = sNum;
  this.instrumentLoadCount = 0;

  this.loadSample(0, aPath, false);
  this.loadSample(1, bPath, false);
  this.loadSample(2, cPath, false);
  this.loadSample(3, dPath, false);
  this.loadSample(4, ePath, false);
  this.loadSample(5, fPath, false);
  this.loadSample(6, gPath, false);

}
//------ Loads Drum Samples ------//
Synth.prototype.loadSample = function(sampleID, url, mixToMono) {
  // Load asynchronously

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  var self = this;

  request.onload = function(){
    self.context.decodeAudioData(
      request.response, function(buffer){
      //  var buffer = context.createBuffer(request.response, mixToMono);
        switch (sampleID) {
          case 0:
            self.aBuffer = buffer;
            break;
          case 1:
            self.bBuffer = buffer;
            break;
          case 2:
            self.cBuffer = buffer;
            break;
          case 3:
            self.dBuffer = buffer;
            break;
          case 4:
            self.eBuffer = buffer;
            break;
          case 5:
            self.fBuffer = buffer;
            break;
          case 6:
            self.gBuffer = buffer;
        }
        successCount++;
        self.instrumentLoadCount++;
        if (self.instrumentLoadCount === self.instrumentCount){
          synthCount++;
          if (synthCount < synths){return;}
        }
      },
      function(){
        errorCount++;
      }
    );
  };
  request.send();
};
