const MongoClient = require('mongodb').MongoClient;

function MongoDao(mongoUri, dbname) {
	var _this = this;
	var options = { useNewUrlParser: true };
	_this.mongoClient = new MongoClient(mongoUri, options);

	return new Promise(function(resolve, reject) {
		_this.mongoClient.connect(function(err, client) {
			console.log("mongo client successfully connected \n");
			_this.dbConnection = _this.mongoClient.db(dbname);
			resolve(_this);
		});
	});
}

MongoDao.prototype.readCollectionAwards = function(collectionName,n) {
	return this.dbConnection.collection(collectionName).find({'awards' : {$exists:true}, $where: `this.awards.length >= ${n}`});
}

MongoDao.prototype.readCollectionWonAwards = function(collectionName,y) {
	return this.dbConnection.collection(collectionName).find({'awards.year' : { $gte : y }});
}

MongoDao.prototype.readCollectionTrade = function(collectionName) {
	return this.dbConnection.collection(collectionName).aggregate([
		{
		   $lookup: {
			  from: "books",
			  localField: "_id",   
			  foreignField: "authorId", 
			  as: "fromBooks"
		   }
		},
		{ "$unwind": "$fromBooks" },
		{
			$group: { _id : '$fromBooks.authorId', totalBooksSold : { $sum : '$fromBooks.sold' }, totalProfit: { $sum : { $multiply: [ "$fromBooks.sold", "$fromBooks.price" ] } }
			}
		 }
		
	 ]);
}

MongoDao.prototype.readCollectionAuthors = function(collectionName,birthDate,totalPrice) {
	return this.dbConnection.collection(collectionName).aggregate([
		{$match: { 'birth' : { $gte : new Date(birthDate) } }},
		   {
			  $lookup: {
				 from: "books",
				 localField: "_id",   
				 foreignField: "authorId", 
				 as: "fromBooks"
			  }
		   },
		   { "$unwind": "$fromBooks" },
		   {
			   $group: { '_id' : '$fromBooks.authorId', 'totalPrice' : { $sum : '$fromBooks.price' } }
			   
			},
			{$match: { 'totalPrice' : { $gte : totalPrice } }}
		   
		])
}

module.exports = MongoDao;