var express = require('express');
var router = express.Router();

// load database module
var db = require('../db/db').knex;

router.get('/', function(req, res) {
  db.select('*').from('users').where('isTutor', 1).leftOuterJoin('studentutor', function(){
    this.on('users.id', "=", 'studentutor.tid')
  })
  .then(function(data){
    //remove all the repeated tutors from query
    var result = [];
    for(var i = 0; i < data.length; i++) {
      if(data[i].tid === null) {
        result.push(data[i]);
      } else {
        var repeat = 0;
        for(var j = 0; j < result.length; j++) {
          if(data[i].tid === result[j].tid) {
            repeat = 1;
          }
        }
        if(repeat === 0) {
          result.push(data[i]);
        }
      }
    }

    for(var k = 0; k < data.length; k++) {
      if(data[k].sid == req.headers.sid) {
        for(var q = 0; q < result.length; q++) {
          if(result[q].tid === data[k].tid) {
            result[q].fav = data[k].fav;
            result[q].sid = data[k].sid;
          }
        }
      }
    }

    for(var i = 0; i < result.length; i++) {
      if(result[i].fav == 1 && result[i].sid == req.headers.sid) {
        result[i].fav = 1;
      } else {
        result[i].fav = 0;
      }
    }

    res.send(result);
  })
})


router.get('/info', function(req, res) {
  var tid = req.headers.tid;
  var sid = req.headers.sid;

  db('studentutor').where({sid: sid, tid: tid})
  .rightOuterJoin('users', 'users.id', 'studentutor.tid')

  .then(function(data) {
    if (!data[0]) {
      db('users').where({id: tid})
      .then(function(data) {
        res.send({id: data[0].id, fullname: data[0].fullname, username: data[0].username, bio: data[0].bio, location: data[0].location, imgurl: data[0].imgurl, javascript: data[0].javascript, ruby: data[0].ruby, python: data[0].python})
      })
    } else {
      res.send({id: data[0].id, fullname: data[0].fullname, username: data[0].username, bio: data[0].bio, location: data[0].location, imgurl: data[0].imgurl, javascript: data[0].javascript, ruby: data[0].ruby, python: data[0].python, status: data[0].status})
    }
  })
})

// export router
module.exports = router;
