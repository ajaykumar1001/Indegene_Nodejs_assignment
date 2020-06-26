const express = require('express');
const app = express();

const MongoDao = require('./mongodao');

const url = 'mongodb://localhost:27017';
 
const dbName = 'assignmentDb';

var mongoDao;

async function main() {
	mongoDao = await new MongoDao(url, dbName);
}

main();

app.get('/awards/:n', function(req, res){
  const { n } = req.params;
  if (n) {
    mongoDao.readCollectionAwards('authors',parseInt(n)).toArray(function(err, docs) {
      console.log(docs.length + " documents available in collection ",docs + " \n");
      res.send(docs);
    });
  }else{
    res.send({error: 'Please provide value for n i.e. number of awards'});
  }
  
});

app.get('/wonAwards/:y', function(req, res){
  const { y } = req.params;
  if (y) {
    mongoDao.readCollectionWonAwards('authors',parseInt(y)).toArray(function(err, docs) {
      console.log(docs.length + " documents available in collection ",docs + " \n");
      res.send(docs);
    }); 
  }
  else{
    res.send({error: 'Please provide value for y i.e. year on awards won'});
  }
});

app.get('/authors', function(req, res){
  mongoDao.readCollectionTrade('authors').toArray(function(err, docs) {
    console.log(docs.length + " documents available in collection ",docs + " \n");
    res.send(docs);
	});
});

app.get('/', function(req, res){
  const { birthDate, totalPrice } = req.query;
  if (birthDate && totalPrice) {
    mongoDao.readCollectionAuthors('authors',birthDate,parseInt(totalPrice)).toArray(function(err, docs) {
      console.log(docs.length + " documents available in collection ",docs + " \n");
      res.send(docs);
    });
  }else{
    res.send({error: 'Please provide birthDate & totalPrice'});
  }
});

app.listen(3000, function() {
    console.log('listening on 3000')
  })