'use strict';

/////// KITS ///////
var kits;
var currentKit = 0;
var kitCount = 0;
var kNumInstruments = 3;
var kitNames = [
  "Drums-of-Death",
  "Earthquake-Ruckus",
  "God-vs-Satan",
];
//------ Initialize Drum Kits ------//
var numKits = kitNames.length;
kits = new Array(numKits);
for (var i  = 0; i < numKits; i++) {
  kits[i] = new Kit(kitNames[i]);
}
//------ Kit Constructor ------//
//Variables: pathName, kNumInstruments
function Kit(name) {
  this.name = name;
  this.pathName = function() {
    var pathName = "audios/drums/" + this.name + "/";
    return pathName;
  };
  //var pathName = this.pathName();
  var kickPath = this.pathName + "kick.wav";
  var snarePath = this.pathName + "snare.wav";
  var hatPath = this.pathName + "hat.wav";

  this.kickBuffer = 0;
  this.snareBuffer = 0;
  this.hatBuffer = 0;

  this.instrumentCount = kNumInstruments;
  this.instrumentLoadCount = 0;

  this.loadSample(0, kickPath, false);
  this.loadSample(1, snarePath, false);
  this.loadSample(2, hatPath, false);
}
//------ Loads Drum Samples ------//
Kit.prototype.loadSample = function(sampleID, url, mixToMono) {
  // Load asynchronously

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var kit = this;

  request.onload = function() {
    context.decodeAudioData(
      request.response, function(buffer) {
        // var buffer = context.createBuffer(request.response, mixToMono);
        switch (sampleID) {
            case 0: kit.kickBuffer = buffer; break;
            case 1: kit.snareBuffer = buffer; break;
            case 2: kit.hatBuffer = buffer; break;
        }
        successCount++;
        var info = document.getElementById("info");
        info.innerHTML = errorCount + " " + successCount;
        kit.instrumentLoadCount++;
        if (kit.instrumentLoadCount == kit.instrumentCount)
          finishLoading();
        }
      },
      function() {
        errorCount++;
        var info = document.getElementById("info");
        info.innerHTML = errorCount + " " + successCount;
      }
    );
  }
  request.send();
}
