var sqlite3 = require('sqlite3');
const spawn = require('child_process').spawn;
var application = null;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var express = require("express");
const path = require('path');

var chartPoint = {x1: 0, y1: 0, x2: 0, y2: 0};

var soccerPenaltyControls = {adaptiveDifficulty: true, level: 1, maxHeight: 1.75, wheelchairMode: false, timewarpMode: false, shootDistance: 1, ballSpeed: 0, difficultyLevel: 1, frequency: 3.6};
var soccerPenaltyIsPaused = true;

// open the database
let db = new sqlite3.Database(path.join(__dirname, '../db/database.db'), sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }else{
    console.log('Connected to the database.');
  }
  console.log(path.join(__dirname, '../db/database.db'));
});

var appRouter = function (app) {
  var expressWs = require('express-ws')(app);
  app.use(express.static(path.join(__dirname, '..','build')));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..','build', 'index.html'));
  });

  app.get("/patients", function (req, res) {
    db.serialize(function() {
      db.all("SELECT * FROM patient", function(err, row) {
        console.log(row);
        res.status(200).send(row);
      });
    });
  });

  app.post('/api/soccerPenalty/addScore', function (req, res) {
    var aWss = expressWs.getWss('/socket/websocket');
    db.serialize(function() {
      db.run("INSERT INTO SoccerPenaltyData (`SessionId`,`Level`,`XValue`,`YValue`,`Speed`,`Result`) VALUES (?,?,?,?,?,?);",req.body.SessionId, req.body.Level, req.body.XValue, req.body.YValue, req.body.Speed, req.body.Result);
    });
    eventEmitter.emit('updateScore');
    res.end("ok");
  });

  app.post('/api/bridge/showStep', function (req, res) {
    var aWss = expressWs.getWss('/socket/websocket');
    console.log(req.body);
    eventEmitter.emit('bridge here');
    res.end("ok");
  });

  app.post('/api/soccerPenalty/addPatient', function (req, res) {
    var aWss = expressWs.getWss('/socket/websocket');
    db.serialize(function() {
      db.run("INSERT INTO Patient (`PatientId`,`FirstName`,`LastName`) VALUES (?,?,?);",req.body.newID, req.body.newFirstName, req.body.newLastName);
    });
    eventEmitter.emit('addPatient');
    res.end("ok");
  });

  app.post('/api/soccerPenalty/modifyPatient', function (req, res) {
    var aWss = expressWs.getWss('/socket/websocket');
    db.serialize(function() {
      if(req.body.column == 'FirstName'){
        db.run("UPDATE Patient SET FirstName = ? WHERE PatientID = ?;", req.body.newValue, req.body.PatientID);
      }
      else if(req.body.column == 'LastName'){
        db.run("UPDATE Patient SET LastName = ? WHERE PatientID = ?;", req.body.newValue, req.body.PatientID);
      }
    });
    eventEmitter.emit('modifyPatient');
    res.end("ok");
  });

  app.post('/api/soccerPenalty/setChartRect', function (req, res) {
    chartPoint = req.body;
    console.log(req.body);
    eventEmitter.emit('setChartRect');
    res.end("ok");
  });

  app.post('/api/soccerPenalty/current/setAdaptiveDifficulty', function (req, res) {

    console.log(req.body.value);
    soccerPenaltyControls.adaptiveDifficulty = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setLevel', function (req, res) {

    console.log(req.body.value);
    soccerPenaltyControls.level = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setDifficultyLevel', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.difficultyLevel = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setMaximumHeight', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.maxHeight = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setBallSpeed', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.ballSpeed = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setShootDistance', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.shootDistance = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setTimeWarpMode', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.timewarpMode = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });
  app.post('/api/soccerPenalty/current/setWheelchairMode', function (req, res) {
    console.log(req.body.value);
    soccerPenaltyControls.wheelchairMode = req.body.value;
    console.log(soccerPenaltyControls);
    eventEmitter.emit('setSoccerPenaltyControls');
    res.end("ok");
  });



  app.post('/api/soccerPenalty/current/setPaused', function (req, res) {

    console.log(req.body.value);
    soccerPenaltyIsPaused = req.body.value;
    eventEmitter.emit('setSoccerPenaltyPlayPause');
    res.end("ok");
  });

  app.post('/api/soccerPenalty/current/newSession', function(req, res){
    var newSessionId = 0;
    db.serialize(function(){
      db.get("SELECT MAX(`SessionId`) AS  'OldSessionId' FROM `GameData`", function(err, row) {
        newSessionId = row.OldSessionId +1;
        db.run("INSERT INTO `GameData`(`GameId`,`PatientId`,`SessionId`,`Timestamp` ) VALUES (?,?,?, datetime('now', 'localtime'));", 1, req.body.PatientId, newSessionId);
        res.status(200).send(JSON.stringify(newSessionId));
      });

    });
  });

  app.get('/api/soccerPenalty/current/goals', function (req, res) {
    db.serialize(function() {
      db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'goal'", function(err, row) {
        console.log(row);
        res.status(200).send(row);
      });
    });
  });
  app.get('/api/soccerPenalty/current/catch', function (req, res) {
    var catches = [];
    var goals = [];
    db.serialize(function() {
      db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'catch'", function(err, row) {
        for(i in row){
          catches.push({x: row[i].XValue, h: row[i].YValue, s: row[i].Speed});
        }
      });
      db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'goal'", function(err, row) {
        for(i in row){
          goals.push({x: row[i].XValue, h: row[i].YValue, s: row[i].Speed});
        }
        var toSend = {"catches":catches, "goals":goals};
        console.log(JSON.stringify(toSend));
        res.status(200).send(JSON.stringify(toSend));
      });

    });
  });

  app.post('/api/soccerPenalty/launchApplication', function(req, res){
    console.log("spawn app");

    var macPath = path.join(__dirname, ('../applications/'+req.body.currentGame+'.app/Contents/MacOS/'+req.body.currentGame));
    application = spawn(macPath, [req.body.currentPatient]);
    application.on('close', console.log.bind(console, 'closed'));
    res.end("ok");
  });

  app.post('/api/soccerPenalty/killApplication', function(req, res){
    console.log("spawn app");
    eventEmitter.emit('sendApplicationQuit');
    res.end("ok");
  });


  app.ws('/socket/websocket', function(ws, req) {
    ws.on('open', function(msg) {
      console.log('opened');
    });
    ws.on('close', function() {
      console.log('closed');
      eventEmitter.removeListener('updateScore', list1 );
    });
    ws.on('message', function(msg) {
      console.log(msg);
    });

    var list1 = function() {
      console.log('updatescore');
      var catches = [];
      var goals = [];
      db.serialize(function() {
        db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'catch' AND `SessionId` = (SELECT MAX(`SessionId`) FROM `GameData` WHERE  `GameId` = 1 )", function(err, row) {
          for(i in row){
            catches.push({x: row[i].XValue, h: row[i].YValue, s: row[i].Speed});
          }
        });
        db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'goal' AND `SessionId` = (SELECT MAX(`SessionId`) FROM `GameData` WHERE  `GameId` = 1 )", function(err, row) {
          for(i in row){
            goals.push({x: row[i].XValue, h: row[i].YValue, s: row[i].Speed});
          }
          var toSend = {"catches":catches, "goals":goals};
          ws.send(JSON.stringify(toSend));
        });
      });
    }
    eventEmitter.on('updateScore', list1 );

  });

  app.ws('/socket/penaltyControl', function(ws, req) {

    ws.on('message', function(msg) {
      console.log(msg);
      ws.send("received");
    });
    ws.on('close', function() {
      console.log('closed');
      eventEmitter.removeListener('sendApplicationQuit', list2 );
      eventEmitter.removeListener('setChartRect', list3 );
      eventEmitter.removeListener('setSoccerPenaltyControls', updateSoccerPenaltyControls );
      eventEmitter.removeListener('setSoccerPenaltyPlayPause', updateSoccerPlayPause );
    });
    var list2 = function(){
      ws.send(JSON.stringify({message: "quit"}));
    }

    var list3 = function(){
      ws.send(JSON.stringify({message: "rectangle",data: chartPoint}));
    }
    var updateSoccerPenaltyControls = function(){
      ws.send(JSON.stringify({message: "control",data: soccerPenaltyControls}));
    }

    var updateSoccerPlayPause = function(){
      ws.send(JSON.stringify({message: "playPause",data: soccerPenaltyIsPaused}));
    }
    eventEmitter.on('sendApplicationQuit', list2 );
    eventEmitter.on('setChartRect', list3 );
    eventEmitter.on('setSoccerPenaltyControls', updateSoccerPenaltyControls );
    eventEmitter.on('setSoccerPenaltyPlayPause', updateSoccerPlayPause );
  });



  //var aWss = expressWs.getWss('/websocket');

  /*setInterval(function () {
  aWss.clients.forEach(function (client) {
  var catches = [];
  var goals = [];
  db.serialize(function() {
  db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'catch' AND `SessionId` = (SELECT MAX(`SessionId`) FROM `GameData` WHERE  `GameId` = 1 )", function(err, row) {
  for(i in row){
  catches.push([row[i].XValue, row[i].YValue, row[i].Speed]);
}
});
db.all("SELECT * FROM SoccerPenaltyData WHERE `Result` = 'goal' AND `SessionId` = (SELECT MAX(`SessionId`) FROM `GameData` WHERE  `GameId` = 1 )", function(err, row) {
for(i in row){
goals.push([row[i].XValue, row[i].YValue, row[i].Speed]);
}
var toSend = {"catches":catches, "goals":goals};
console.log(JSON.stringify(toSend));
client.send(JSON.stringify(toSend));
});

});
});
}, 10000);*/


}



module.exports = appRouter;
