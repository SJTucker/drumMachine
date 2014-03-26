'use strict';

var kitCount = 0;
var errorCount = 0;
var successCount = 0;
var kits = 3;

//------ Kit Constructor ------//
function Kit(context, name, kNum) {
  this.context = context;
  this.name = name;
  this.pathName = '../../audios/' + this.name + '/';
  //var pathName = this.pathName();
  var kickPath = this.pathName + 'kick.wav';
  var snarePath = this.pathName + 'snare.wav';
  var hatPath = this.pathName + 'hat.wav';

  this.kickBuffer = 0;
  this.snareBuffer = 0;
  this.hatBuffer = 0;

  this.instrumentCount = kNum;
  this.instrumentLoadCount = 0;

  this.loadSample(0, kickPath, false);
  this.loadSample(1, snarePath, false);
  this.loadSample(2, hatPath, false);

  console.log(this);
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
        // var buffer = context.createBuffer(request.response, mixToMono);
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

