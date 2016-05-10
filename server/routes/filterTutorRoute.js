var express = require('express');
var router = express.Router();

// load database module
var db = require('../db/db').knex;

router.get('/', function(req, res) {
  console.log('sid', req.headers.sid)
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
    console.log('data', data)
    console.log('result', result)
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

    // for(var i = 0; i < result.length; i++) {
    //   result[i].fav = result[i].fav || 0;
    // }

    res.send(result);
  })
})


router.get('/info', function(req, res) {
  console.log(req.headers)
  var tid = req.headers.tid;
  var sid = req.headers.sid;
  console.log('tid ', tid);
  console.log('sid ', sid);
  db('studentutor').where({sid: sid, tid: tid})
  .rightOuterJoin('users', 'users.id', 'studentutor.tid')

  .then(function(data) {
    if (!data[0]) {
      db('users').where({id: tid})
      .then(function(data) {
        console.log('new filtertutourroute data',data);
        res.send({id: data[0].id, fullname: data[0].fullname, username: data[0].username, bio: data[0].bio, location: data[0].location, imgurl: data[0].imgurl, javascript: data[0].javascript, ruby: data[0].ruby, python: data[0].python})
      })
    } else {
      console.log('existing filtertutourroute data',data);
      res.send({id: data[0].id, fullname: data[0].fullname, username: data[0].username, bio: data[0].bio, location: data[0].location, imgurl: data[0].imgurl, javascript: data[0].javascript, ruby: data[0].ruby, python: data[0].python, status: data[0].status})
    }
  })
})

router.get('/search_language', function(req, res) {
  var sid = req.headers.sid;
  var language = req.headers.language.toLowerCase();
  if (language === undefined) {
    db('studentutor').where({sid: sid}).leftOuterJoin('users', 'users.id', 'studentutor.sid')
    .where({isTutor: 1})
    .then(function(data){
      console.log(data);
      res.send(data);
    })
  }

  if (language === 'javascript') {
    db('users').where({isTutor: 1, javascript: 1})
    .then(function(data){
      console.log(data);
      res.send(data);
    })
  }

  if (language === 'ruby') {
    db('users').where({isTutor: 1, ruby: 1})
    .then(function(data){
      console.log(data);
      res.send(data);
    })
  }

  if (language === 'python') {
    db('users').where({isTutor: 1, python: 1})
    .then(function(data){
      console.log(data);
      res.send(data);
    })
  }
})

// export router
module.exports = router;
