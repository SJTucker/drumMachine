'use strict';

var kitCount = 0;
var errorCount = 0;
var successCount = 0;
var kits = 9;

//------ Kit Constructor ------//
function Kit(context, name, kNum) {
  this.context = context;
  this.name = name;
  this.pathName = '../../audios/' + this.name + '/';
  //var pathName = this.pathName();
  var kickPath = this.pathName + 'kick.wav';
  var snarePath = this.pathName + 'snare.wav';
  var hatPath = this.pathName + 'hat.wav';
  var tomPath = this.pathName + 'tom.wav';
  var ohatPath = this.pathName + 'ohat.wav';

  this.kickBuffer = 0;
  this.snareBuffer = 0;
  this.hatBuffer = 0;
  this.tomBuffer = 0;
  this.ohatBuffer = 0;

  this.instrumentCount = kNum;
  this.instrumentLoadCount = 0;

  this.loadSample(0, kickPath, false);
  this.loadSample(1, snarePath, false);
  this.loadSample(2, hatPath, false);
  this.loadSample(3, tomPath, false);
  this.loadSample(4, ohatPath, false);

}
//------ Loads Drum Samples ------//
Kit.prototype.loadSample = function(sampleID, url, mixToMono) {
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
            self.kickBuffer = buffer;
            break;
          case 1:
            self.snareBuffer = buffer;
            break;
          case 2:
            self.hatBuffer = buffer;
            break;
          case 3:
            self.tomBuffer = buffer;
            break;
          case 4:
            self.ohatBuffer = buffer;
        }
        successCount++;
        self.instrumentLoadCount++;
        if (self.instrumentLoadCount === self.instrumentCount){
          kitCount++;
          if (kitCount < kits){return;}
        }
      },
      function(){
        errorCount++;
      }
    );
  };
  request.send();
};

