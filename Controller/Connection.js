var pg = require('pg');
var redis = require('redis');
//var logger = require("../logger");

var pgConString = "postgres://famhook:famhook21@localhost:5444/famhook";

var redisClient;

var config = {
  user: 'milkadmin',  
  database: 'MilkDelivery',
  password: 'milkadmin',
  host: 'localhost', 
  port: 5444, 
  max: 10,  
  idleTimeoutMillis: 30000,  
};

var configServer = {
  user: 'milkadmin',  
  database: 'godscreationmilk',
  password: 'milkadmin',
  host: 'pg-lord-bless-jack.cwpa8pzo7itu.us-west-2.rds.amazonaws.com', 
  port: 5432, 
  max: 10,  
  idleTimeoutMillis: 30000,  
};

//var pool = new pg.Pool(configServer);
var pool = new pg.Pool(config);

//Create a PG connection pool.
exports.pgConnectionPool = function(callback){

    pool.connect(function(err, client, done) {
    if(err) {
        //console.error('Error while fetching client from pool', err);
       // logger.debug("Error while connecting to PG" + err);
        callback(err);
    }
    else
    {
        callback(null, client, done);
    }
});
};

//Select Functions : Params in sequence: Query / Pg Function to be called, parameters in JS array, 
//client connection created by caller class and callback function.
exports.pgSelectQuery = function(queryString, paramsArray, clientConn, callback){
    clientConn.queryAsync("BEGIN").then(function(result){
          clientConn.queryAsync(queryString, paramsArray).then(function(result)
          {            
            //console.log(result);
            clientConn.queryAsync("FETCH All from records").then(function(resultFetch)
            {                    
                callback(null, resultFetch);
            });
            
            clientConn.query('COMMIT');
          }).catch(function(err){
            clientConn.query('COMMIT');
            callback(err);
          });
        }).catch(function(err){
            callback(err);
        });
};

//Insert or Update functions: Params in seq.: Query / Pg Function to be called, parameters in JS array, 
//client connection created by caller class and callback function.
exports.pgExecuteQuery = function(queryString, paramsArray, clientConn, callback){   
          var sendValue = {text:queryString, values:paramsArray}; 
          clientConn.queryAsync(sendValue).then(function(result)
          {                              
            callback(null, result);            
          }).catch(function(err){            
            callback(err);
          });
        
};

// exports.getPGConnection = function(callback)
// {
// 	try
// 	{
// 		var client = new pg.Client(pgConString);
// 		client.connect(function(err){
// 			if(err)
// 			{
// 				//console.log("Error while PG connection" + err);
// 				//logger.debug("Error while connecting to PG" + err);
// 				callback(err);
// 			}
// 			else
// 			{
// 				callback(null,client);
// 			}
// 		});
// 	}
// 	catch(err)
// 	{
// 		//console.log("Error while PG connection" + err);
// 		//logger.debug("Error while connecting to PG" + err);
// 	}
// };

// exports.rollback = function(client) 
// {
//   //terminating a client connection will
//   //automatically rollback any uncommitted transactions
//   //so while it's not technically mandatory to call
//   //ROLLBACK it is cleaner and more correct
//   client.query('ROLLBACK', function() {
//     client.end();
//   });
// };

// exports.redisClientObject = function(port, host, callback)
// {
// 	if(!host)
// 	{
// 		host = "127.0.0.1";
// 		port = "6379";
// 	}
// 	try
// 	{
// 		if(!redisClient)
// 		{
// 			redisClient = redis.createClient(port, host);
// 			redisClient.on('connect', function()
// 			{
// 				console.log('Redis connected');
// 			});
// 		}
// 		callback(null, redisClient);
// 	}
// 	catch(err){
// 		console.log("Error while Redic connection" + err);
// 		logger.debug("Error while connecting to Redis" + err);
// 		callback("Error while connecting to Redis");
// 	}
// };


// exports.getDBSchema = function(username)
// {
// 	return "famhook21";	
// };