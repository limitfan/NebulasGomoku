"use strict";

var NebulasGomoku = function () {
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineProperty(this, "rankSize");
    LocalContractStorage.defineProperty(this, "deployedTime");
    LocalContractStorage.defineMapProperty(this, "nasAddrMap");
    LocalContractStorage.defineMapProperty(this, "nasTimeMap");
    LocalContractStorage.defineMapProperty(this, "action");
    LocalContractStorage.defineMapProperty(this, "rankAddr");
    LocalContractStorage.defineMapProperty(this, "rankTimeScore");
    LocalContractStorage.defineMapProperty(this, "rankSteps");
};

NebulasGomoku.prototype = {
  init: function () {
    this.size = 0;
    this.rankSize = 0;
    this.deployedTime = Math.round(new Date().getTime()/1000);
  },

  saveStatus: function (actioncode) {
    this.nasAddrMap.put(this.size, Blockchain.transaction.from);
    this.nasTimeMap.put(this.size, Blockchain.transaction.timestamp);
    if(actioncode == "0"){
      this.action.put(this.size, "play");
    }
    else if (actioncode == "1"){
      this.action.put(this.size, "watch");
    }
    else {
      this.action.put(this.size, "other");
    }

    this.size += 1;     
  },
  
  saveScore: function(score, steps) {
           
    this.rankAddr.put(this.rankSize, Blockchain.transaction.from);
    this.rankTimeScore.put(this.rankSize, score);
    this.rankSteps.put(this.rankSize, steps);
    this.rankSize += 1;      
  },

  getTopScores: function () {
     var index = 0;
     var result = [];
     var resind = [];
     var rescnt = Math.min(10, this.rankSize);
     var loop = 0;
     for (loop;loop<rescnt;loop++){
        var currmin = 0x7fff;
        var currind = loop;
        index = 0;
        for(index;index<this.rankSize;index++){
            
            var ind = 0;
            var isRanked = false;
            for(ind;ind<resind.length;ind++){
                if(index == resind[ind]){
                    isRanked = true;
                }
            }

            if(!isRanked){
                var curr = this.rankTimeScore.get(index);
                if(curr<currmin){
                    currmin = curr;
                    currind = index;
                }
            }
         }
         resind.push(currind);
     }
     loop = 0;
     for(loop;loop<rescnt;loop++){
        result.push(this.rankAddr.get(resind[loop]));
        result.push(this.rankTimeScore.get(resind[loop]));
        result.push(this.rankSteps.get(resind[loop]));
     }
     return result;
  },
  getAllStatus: function(){
     var index = 0;
     var result = [];
     for (index;index<this.size;index++){
         var addr = this.nasAddrMap.get(index);
         var timestamp = this.nasTimeMap.get(index);
         var actionstr = this.action.get(index);
         result.push(addr);
         result.push(timestamp);
         result.push(actionstr);
     }
     return result;
  },

  getDeployTime: function(){
     return this.deployedTime;
  },
  getContractCallTime: function(){
    return Blockchain.transaction.timestamp;
  },
  getInfo: function(){
     return Blockchain.transaction.from;
  }
};
module.exports = NebulasGomoku;
