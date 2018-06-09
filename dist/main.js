(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SCORE = require("./score.js");

var score = function(count, block, empty) {

  if(empty === undefined) empty = 0;

  //没有空位
  if(empty == 0) {
    if(count >= 5) return SCORE.FIVE;
    if(block === 0) {
      switch(count) {
        case 1: return SCORE.ONE;
        case 2: return SCORE.TWO;
        case 3: return SCORE.THREE;
        case 4: return SCORE.FOUR;
      }
    }

    if(block === 1) {
      switch(count) {
        case 1: return SCORE.BLOCKED_ONE;
        case 2: return SCORE.BLOCKED_TWO;
        case 3: return SCORE.BLOCKED_THREE;
        case 4: return SCORE.BLOCKED_FOUR;
      }
    }

  } else if(empty === 1 || empty == count-1) {
    //第二个是空位
    if(count >= 6) {
      return SCORE.FIVE;
    }
    if(block === 0) {
      switch(count) {
        case 2: return SCORE.TWO;
        case 3:
        case 4: return SCORE.THREE;
        case 5: return SCORE.FOUR;
      }
    }

    if(block === 1) {
      switch(count) {
        case 2: return SCORE.BLOCKED_TWO;
        case 3: return SCORE.BLOCKED_THREE;
        case 4: return SCORE.THREE;
        case 5: return SCORE.BLOCKED_FOUR;
      }
    }
  } else if(empty === 2 || empty == count-2) {
    //第二个是空位
    if(count >= 7) {
      return SCORE.FIVE;
    }
    if(block === 0) {
      switch(count) {
        case 3:
        case 4:
        case 5: return SCORE.THREE;
        case 6: return SCORE.FOUR;
      }
    }

    if(block === 1) {
      switch(count) {
        case 3: return SCORE.BLOCKED_THREE;
        case 4: return SCORE.BLOCKED_FOUR;
        case 5: return SCORE.BLOCKED_FOUR;
        case 6: return SCORE.FOUR;
      }
    }

    if(block === 2) {
      switch(count) {
        case 4:
        case 5:
        case 6: return SCORE.BLOCKED_FOUR;
      }
    }
  } else if(empty === 3 || empty == count-3) {
    if(count >= 8) {
      return SCORE.FIVE;
    }
    if(block === 0) {
      switch(count) {
        case 4:
        case 5: return SCORE.THREE;
        case 6: return SCORE.THREE*2;
        case 7: return SCORE.FOUR;
      }
    }

    if(block === 1) {
      switch(count) {
        case 4:
        case 5:
        case 6: return SCORE.BLOCKED_FOUR;
        case 7: return SCORE.FOUR;
      }
    }

    if(block === 2) {
      switch(count) {
        case 4:
        case 5:
        case 6:
        case 7: return SCORE.BLOCKED_FOUR;
      }
    }
  } else if(empty === 4 || empty == count-4) {
    if(count >= 9) {
      return SCORE.FIVE;
    }
    if(block === 0) {
      switch(count) {
        case 5:
        case 6:
        case 7:
        case 8: return SCORE.FOUR;
      }
    }

    if(block === 1) {
      switch(count) {
        case 4:
        case 5:
        case 6:
        case 7: return SCORE.BLOCKED_FOUR;
        case 8: return SCORE.FOUR;
      }
    }

    if(block === 2) {
      switch(count) {
        case 5:
        case 6:
        case 7:
        case 8: return SCORE.BLOCKED_FOUR;
      }
    }
  } else if(empty === 5 || empty == count-5) {
    return SCORE.FIVE;
  }

  return 0;
}

module.exports = score;

},{"./score.js":8}],2:[function(require,module,exports){
var r = require("./role");
var SCORE = require("./score.js");
var score = require("./count-to-score.js");


var eRow = function(line, role) {
  var count = 0; // 连子数
  var block = 0; // 封闭数
  var empty = 0;  //空位数
  var value = 0;  //分数

  for(var i=0;i<line.length;i++) {
    if(line[i] == role) { // 发现第一个己方棋子
      count=1;
      block=0;
      empty=0;

      //判断左边界
      if(i==0) block=1;
      else if(line[i-1] != r.empty) block = 1;

      //计算己方棋子数
      for(i=i+1;i<line.length;i++) {
        if(line[i] == role) {
          count ++;
        } else if(!empty && i < line.length-1 && line[i] == r.empty && line[i+1] == role) empty=count;  //只计算中间的一个空位，也就是己方棋子之间的一个空位。
        else break;
      }

      //判断右边界
      if(i==line.length || line[i] != r.empty) block++;
      value += score(count, block, empty);
    }
  }

  return value;
}

module.exports = eRow;

},{"./count-to-score.js":1,"./role":7,"./score.js":8}],3:[function(require,module,exports){
var eRow = require("./evaluate-row.js");

var eRows = function(rows, role) {
  var r = 0;
  for(var i=0;i<rows.length;i++) {
    r+=eRow(rows[i], role);
  }
  return r;
}

module.exports = eRows;

},{"./evaluate-row.js":2}],4:[function(require,module,exports){
var flat = require("./flat");
var R = require("./role");
var eRows = require("./evaluate-rows.js");

var evaluate = function(board) {
  var rows = flat(board);
  var humScore = eRows(rows, R.hum);
  var comScore = eRows(rows, R.com);

  return comScore - humScore;
}

module.exports = evaluate;

},{"./evaluate-rows.js":3,"./flat":5,"./role":7}],5:[function(require,module,exports){
//一维化，把二位的棋盘四个一位数组。
var flat = function(board) {
  var result = [];
  var len = board.length;

  //横向
  for(var i=0;i<len;i++) {
    result.push(board[i]);
  }


  //纵向
  for(var i=0;i<len;i++) {
    var col = [];
    for(var j=0;j<len;j++) {
      col.push(board[j][i]);
    }
    result.push(col);
  }


  // \/ 方向
  for(var i=0;i<len*2;i++) {
    var line = [];
    for(var j=0;j<=i && j<len;j++) {
      if(i-j<len) line.push(board[i-j][j]);
    }
    if(line.length) result.push(line);
  }


  // \\ 方向
  for(var i=-1*len+1;i<len;i++) {
    var line = [];
    for(var j=0;j<len;j++) {
      if(j+i>=0 && j+i<len) line.push(board[j+i][j]);
    }
    if(line.length) result.push(line);
  }

  
  return result;
}

module.exports = flat;

},{}],6:[function(require,module,exports){
var e = require("./evaluate.js");
var S = require("./score.js");
var R = require("./role.js");
var win = require("./win.js");

var Board = function(container, status) {
  this.container = container;
  this.status = status;
  this.step = this.container.width() * 0.065;
  this.offset = this.container.width() * 0.044;
  this.steps = [];  //存储

  this.started = false;


  var self = this;
  this.container.on("click", function(e) {
    if(self.lock || !self.started) return;
    var y = e.offsetX, x = e.offsetY;
    x = Math.floor((x+self.offset)/self.step) - 1;
    y = Math.floor((y+self.offset)/self.step) - 1;
    console.log("board on click");
    self.set(x, y, 1);
  });

  this.worker = new Worker("./dist/bridge.js");

  this.worker.onmessage = function(e) {
    self._set(e.data[0], e.data[1], R.com);
    self.lock = false;
    self.setStatus("电脑下子("+e.data[0]+","+e.data[1]+"), 用时"+((new Date() - self.time)/1000)+"秒");
  }
  this.setStatus("请点击开始按钮");

}

Board.prototype.start = function() {

  if(this.started) return;
  this.initBoard();
  
  this.board[7][7] = R.com;
  this.steps.push([7, 7]);

  this.draw();

  this.setStatus("欢迎加入五子棋游戏");

  this.started = true;
   
  this.startTime = (new Date());
}

var isReplaying = false;
Board.prototype.startReplay = function() {
  if(this.started) return;
  this.initBoard();
  this.setStatus("正在replay五子棋...");
  isReplaying = true;
  this.started = true;
}

Board.prototype.stop = function() {
  if(!this.started) return;
  this.setStatus("请点击开始按钮");
  this.started = false;
}


Board.prototype.stopReplay = function() {
  if(!this.started) return;
  this.setStatus("Replay结束,请点击开始按钮");
  isReplaying = false;
  this.started = false;
}


Board.prototype.initBoard = function() {
  this.board = [];
  for(var i=0;i<15;i++) {
    var row = [];
    for(var j=0;j<15;j++) {
      row.push(0);
    }
    this.board.push(row);
  }
  this.steps = [];
}

Board.prototype.draw = function() {
  var container = this.container;
  var board = this.board;
  
  container.find(".chessman, .indicator").remove();

  for(var i=0;i<board.length;i++) {
    for(var j=0;j<board[i].length;j++) {
      if(board[i][j] != 0) {
        var chessman = $("<div class='chessman'></div>").appendTo(container);
        if(board[i][j] == 2) chessman.addClass("black");
        chessman.css("top", this.offset + i*this.step);
        chessman.css("left", this.offset + j*this.step);
      }
    }
  }

  if(this.steps.length > 0) {
    var lastStep = this.steps[this.steps.length-1];
    $("<div class='indicator'></div>")
      .appendTo(container)
      .css("top", this.offset + this.step * lastStep[0])
      .css("left", this.offset + this.step * lastStep[1])
  }

}

var aset = function(x, y, Role){
  b.autoset(x,y,Role);
  //b.autoset(2,3,2);
}

var w;
function startWorker(autosteps){
  w = new Worker('./dist/twosecs.js');
  b.startReplay();
  var cnt = 0;
  var arr = autosteps.split('-');
  var ind = 0;
  var inc = 2;

  w.onmessage = function(event) {
    console.log("web worker...");
    aset(arr[ind],arr[ind+1],2 -(ind/2)%2);
    cnt++;
    ind += inc;
    if(ind == arr.length){
       stopWorker();
       b.stopReplay();
    }
  }; 

}
function stopWorker() { 
    w.terminate();
    w = undefined;
}
function replay(autosteps){
  b.start();
  var arr = autosteps.split('-');
  var ind = 0;
  var inc = 2;
  for (ind;ind<arr.length;ind+=inc){ 
    
  //b.autoset(8,8,1);
 // b.autoset(2,3,2);
  //b.autoset(4,4,1);
  }
 //  setTimeout( 
//  Thread.sleep(2000); 
//  aset(8,8,1);
//  Thread.sleep(2000);
//  aset(4,5,2);
//  Thread.sleep(2000);
//  aset(4,3,1);
  //b.set(8,9,1);

}

function cbsubmitscore(resp) {
    console.log("submitscore rpc call resp: " + resp);
}
function submitscorecontract(score, steps){
   var value = "0";
   var rtime = "t";
   var key = dappAddress;
   var to = dappAddress;
   var callFunction = "saveScore";
   var callArgs = '["'+score+'","'+steps+'"]';
   console.log("request of key: " + key +", rtime="+rtime);
        nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: cbsubmitscore
        });

}
Board.prototype._set = function(x, y, role) {
  this.board[x][y] = role;
  this.steps.push([x,y]);
  this.draw();
  var value = e(this.board);
  var w = win(this.board);
  var self = this;
  //var elapsedtime = ((new Date() - self.time)/1000);
  //console.log("elapsed time:"+elapsedtime);
  if(!isReplaying){
  if(w == R.com) {
    console.log("steps:"+this.steps.length);
    $.alert("电脑赢了！", function() {
      self.stop();
    });
  } else if (w == R.hum) {
    console.log("steps:"+this.steps.length);
    var savesteps = "";
    var ind = 0;
    for(ind;ind<this.steps.length;ind++){
       savesteps += this.steps[ind][0]+"-"+this.steps[ind][1];
       if(ind!=(this.steps.length-1)){
        savesteps += "-";
       }
    }
    var savescore = (new Date() - this.startTime)/1000;
    console.log("submit steps:"+savesteps);
    console.log("submit scoretime:"+savescore);
    $.alert("恭喜你赢了！确定提交成绩到Nebulas Blockchain.", function() {
     submitscorecontract(savescore, savesteps); 
     self.stop();
    });

     }
    
//    $.confirm({
 //   title: '提交成绩',
 //   text: '恭喜你赢了！确定提交成绩到Nebulas Blockchain.',
 //   onOK: function () {
    //点击确认i
    //  submitscorecontract();
   //   self.stop();
  //  },
  //  onCancel: function () {

  //    self.stop();
  //  }
 //  });
     
  }
}

Board.prototype.set = function(x, y, role) {
  if(this.board[x][y] !== 0) {
    throw new Error("此位置不为空");
  }
  this._set(x, y, role);
  this.com();
}


Board.prototype.autoset = function(x, y, role) {
  if(this.board[x][y] !== 0) {
    throw new Error("此位置不为空");
  }
  this._set(x, y, role);
}


Board.prototype.com = function(x, y, role) {
  this.lock = true;
  this.time = new Date();
  this.worker.postMessage({
    board: this.board
  });
  this.setStatus("电脑正在思考...");
}

Board.prototype.setStatus = function(s) {
  this.status.text(s);
}

Board.prototype.back = function(step) {
  if(this.lock) {
    this.setStatus("电脑正在思考，请稍等..");
    return;
  }
  step = step || 1;
  while(step && this.steps.length >= 2) {
    var s = this.steps.pop();
    this.board[s[0]][s[1]] = R.empty;
    s = this.steps.pop();
    this.board[s[0]][s[1]] = R.empty;
    step --;
  }
  this.draw();
}

var dappAddress = "n1y9yuHpoxczUyUNfR9Aa1xCrhw4XgTzpDD";
var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();

var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

function callcontract(action){
        var value = "0";
	var rtime = "t";
	var key = dappAddress;
        var to = dappAddress;
        var callFunction = "saveStatus";
        var callArgs = "["+action+"]";
        console.log("request of key: " + key +", rtime="+rtime);
        nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: cbPush
        });
  
   if(!isReplaying){
    b.start();
    running = true;
    }
    else{
     startWorker(stepsdata);
    }



}

function simcallcontract(){
    var from = Account.NewAccount().getAddressString();
    var to = dappAddress;
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getAllStatus";
    var callArgs = "";
    var contract = {
      "function":callFunction
    }
    neb.api.call(from,dappAddress,value,nonce,gas_price, gas_limit,contract).then(function(resp){
      cbsimcallcontract(resp);
    }).catch(function(err){
      console.log("error:"+err.message);
     });
}

var ranklist = '<div class="leaderboard"> <div class="leaderboard--header"> <div class="leaderboard--item"> <div class="leaderboard--item--cell leaderboard--item--cell__rank"> <span>Rank</span> </div> <div class="leaderboard--item--cell leaderboard--item--cell__user"> <span>User</span> </div> <div class="leaderboard--item--cell leaderboard--item--cell__thirty"> <span>Time</span> </div> <div class="leaderboard--item--cell leaderboard--item--cell__alltime"> <span>Replay</span> </div> </div> </div> <div class="leaderboard--list">';
var statuslist='<div class="leaderboard"> <div class="leaderboard--header"> <div class="leaderboard--item"> <div class="leaderboard--item--cell leaderboard--item--cell__thirty"> <span>Time</span> </div> <div class="leaderboard--item--cell leaderboard--item--cell__user"> <span>User</span> </div> <div class="leaderboard--item--cell leaderboard--item--cell__alltime"> <span>Action</span> </div> </div> </div> <div class="leaderboard--list">';


var sec1 = '<div class="leaderboard--item"><div class="leaderboard--item--cell leaderboard--item--cell__thirty">';
var sec2 = '</div><div class="leaderboard--item--cell leaderboard--item--cell__user">';
var sec3 = '</div><div class="leaderboard--item--cell leaderboard--item--cell__alltime">';
var sec4 = '</div></div>';
var secEnd = "</div></div></div>";
var rsec1 = '<div class="leaderboard--list"><div class="leaderboard--item"><div class="leaderboard--item--cell leaderboard--item--cell__rank">';
var rsec2 = '</div><div class="leaderboard--item--cell leaderboard--item--cell__user">';
var rsec3 = '</div><div class="leaderboard--item--cell leaderboard--item--cell__thirty">';
var rsec4 = '</div><div class="leaderboard--item--cell leaderboard--item--cell__alltime">';
var rsec5 = '</div></div>';
function cbsimcallcontract(resp){
  console.log("all status:"+JSON.stringify(resp.result));
//  $('#scrollable-content').html(JSON.stringify(resp.result));
  var statusstr = JSON.stringify(resp.result);
  statusstr = removechar(statusstr);
  var arr = statusstr.split(',');
  console.log("all stauts log:"+arr.length);
  var dec = 3;
  var res = "";
  if(arr.length<3){
    arr = [];
   }
  var ind = arr.length-1;
  for(ind;ind>=0;ind-=dec){
     var d = new Date();
     var b = new Date(arr[ind-1]*1000);
     res += sec1+seconds2time((d-b)/1000)+" ago"+sec2+arr[ind-2]+sec3+arr[ind]+sec4;
  }
  res += secEnd;
  $('#scrollable-content').html(statuslist+res);

}

var rsecplay1 = '<button class="watch" data="';
var rsecplay2 = '">Watch</button>';

function seconds2time (seconds) {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
    var seconds = Math.floor(seconds);
    var time = "";

    if (hours != 0) {
      time = hours+":";
    }
    if (minutes != 0 || time !== "") {
      minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
      time += minutes+":";
    }
    if (time === "") {
      time = seconds+"s";
    }
    else {
      time += (seconds < 10) ? "0"+seconds : String(seconds);
    }
    return time;
}

function removechar(str){
   var ret = "";
   var ind = 0;
   for(ind;ind<str.length;ind++){
     var c = str.charAt(ind);
     if(c=='"'|| c=='[' || c ==']'|| c == "\\"){

     }
     else{
      ret += c;
     }
   }
   return ret;
}

function cbcallrankcontract(resp){
  console.log("all rank:"+JSON.stringify(resp.result));
  var rankstr = JSON.stringify(resp.result);
  rankstr = removechar(rankstr);
  var arr = rankstr.split(',');
  var ind = 0;
  var inc = 3;
  var res = "";
  var rank = 1;
  if(arr.length < 3)
    arr = [];
  for(ind;ind<arr.length;ind+=inc){
     res += rsec1+(rank)+rsec2+arr[ind]+rsec3+arr[ind+1]+rsec4+rsecplay1+arr[ind+2]+rsecplay2+rsec5;
     rank++;
  }
  res += secEnd;

  $('#scrollable-content').html(ranklist+res);
 
  
  $('.watch').on('click', function(){
    $('.wrap, a').toggleClass('active');
    var data = $(this).attr("data");
    console.log("replay data:"+data);
    //replay(data);
    stepsdata = data;
    isReplaying = true;
    callcontract("1");
    return false;
  });
 
  
}
var stepsdata = "";
function cbPush(resp) {
    console.log("return of rpc call resp: " + resp);
   // if(!isReplaying){
   // b.start();
   //  running = true;
   // }
   // else{
   //  startWorker(stepsdata);
   // }
}

function callrankcontract(){
    var from = Account.NewAccount().getAddressString();
    var to = dappAddress;
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getTopScores";
    var callArgs = "";
    var contract = {
      "function":callFunction
    }
    neb.api.call(from,dappAddress,value,nonce,gas_price, gas_limit,contract).then(function(resp){
      cbcallrankcontract(resp);
    }).catch(function(err){
      console.log("error:"+err.message);
     });
}
$('#ranklist').on('click', function(){
//  console.log("toggle is clicked");
  callrankcontract();
  //replay();
  $('#scrollable-content').html("<h2 align='center'>加载中...</h2>");
  $('#poptitle').html("Nebulas五子棋排行榜");
  $('.wrap, a').toggleClass('active'); 
  return false;
});


function watchReplay(){

  console.log("watch replay");
  $('.wrap, a').toggleClass('active');

};

//module.exports = watchReplay;


$('#status').on('click', function(){
      
  simcallcontract();
  $('#scrollable-content').html("<h2 align='center'>加载中...</h2>");
  $('#poptitle').html("Nebulas五子棋运行状态");
  $('.wrap, a').toggleClass('active');
  return false;

});

$('#close').on('click', function(){
  $('.wrap, a').toggleClass('active');
  return false;
});




var b = new Board($("#board"), $(".status"));
$("#start").click(function() {
  //b.start();
  callcontract('0');
});

var running = false;
$("#fail").click(function() {
  if(running){
  $.confirm("确定认输吗?", function() {
    b.stop();
  });
  }
});

$("#back").click(function() {
  b.back();
});

},{"./evaluate.js":4,"./role.js":7,"./score.js":8,"./win.js":9}],7:[function(require,module,exports){
module.exports = {
  com: 2,
  hum: 1,
  empty: 0,
  reverse: function(r) {
    return r == 1 ? 2 : 1;
  }
}

},{}],8:[function(require,module,exports){
module.exports = {
  ONE: 10,
  TWO: 100,
  THREE: 1000,
  FOUR: 10000,
  FIVE: 100000,
  BLOCKED_ONE: 2,
  BLOCKED_TWO: 10,
  BLOCKED_THREE: 100,
  BLOCKED_FOUR: 1501  //这个1分是用来判断是否是冲四的
}

},{}],9:[function(require,module,exports){
var flat = require("./flat.js");
var eRow = require("./evaluate-row.js");
var r = require("./role");
var S = require("./score.js");

module.exports = function(board) {
  var rows = flat(board);

  for(var i=0;i<rows.length;i++) {
    var value = eRow(rows[i], r.com);
    if(value >= S.FIVE) {
      return r.com;
    } 
    value = eRow(rows[i], r.hum);
    if (value >= S.FIVE) {
      return r.hum;
    }
  }
  return false;
}

},{"./evaluate-row.js":2,"./flat.js":5,"./role":7,"./score.js":8}]},{},[6]);
