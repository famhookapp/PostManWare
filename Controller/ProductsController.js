//Default packages
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var promise = require("bluebird");
var pg = require('pg');
var fs = require('fs');
var jwt = require('jsonwebtoken');
//Custom packages
var logger = require("../Logger.js");
var messages = require('../GlobalMessages.js');
var conn = require("./Connection.js");
var util = require("./Utility.js");


promise.promisifyAll(bcrypt);
promise.promisifyAll(pg);

//Get all the products, if keywords are supplied then filter the records as per the filters
exports.getProducts = function(req, res) {  
  // Set the client properties that came from the POST data
  if(req.body && req.body.orderby)
  { 
    logger.info("ProductsControl - products list");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {
        var searchKeyword, brandid, categoryid;
        searchKeyword = (req.body.searchkey) ? req.body.searchkey : '';
        brandid = (req.body.brandid) ? req.body.brandid : '';
        categoryid = (req.body.categoryid) ? req.body.categoryid : 0;
        //Get the list of products pass values search keyword, orderby, brand id, category id. Orderby is mandatory.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_products($1,$2,$3,$4,$5)";
        var paramsArr = [searchKeyword,req.body.orderby,brandid,categoryid,req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the product list " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.productsListError});                  
                }
            }
            done(err);
        });
      }
    });
  }
  else
  {
    logger.error("ProductsControl - Order by field not provided.");
    res.status(200);     
    res.json({status:messages.apiStatusError,message:messages.productListOrderBy});
  }};

//Get single product, this will be used for selected product information display.
exports.getSingleProduct = function(req, res) {  
  // Set the client properties that came from the POST data
  if(req.body && req.body.productid)
  { 
    logger.info("ProductsControl - products single select");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {        
        //Get the single selected product information.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_singleproduct($1,$2)";
        var paramsArr = [req.body.productid,req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the single product " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.productSelectedInfoError});                  
                }
            }
            done(err);
        });
      }
    });
  }
  else
  {
    logger.error("ProductsControl - Product Id not passed");
    res.status(200);     
    res.json({status:messages.apiStatusError,message:messages.productIdError});
  }};

//Get delivery options from the table.
exports.getDeliveryOptions = function(req, res) {  
  // Set the client properties that came from the POST data
 
    logger.info("ProductsControl - delivery options");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {        
        //Get the single selected product information.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_dailyoptions($1)";
        var paramsArr = [req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the delivery options " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.deliveryOptionsError});                  
                }
            }
            done(err);
        });
      }
    });
  
  };

 //Get home page top and bottom banner ads
exports.getHomeAdBanners = function(req, res) {  
  // Set the client properties that came from the POST data
  if(req.decoded && req.decoded.schema)
  { 
    logger.info("ProductsControl - banners for top and bottom home page");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {        
        //Get the single selected product information.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_homeads($1)";
        var paramsArr = [req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the home page banner " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.homepageBannerError});                  
                }
            }
            done(err);
        });
      }
    });
  }
  else
  {
    logger.error("ProductsControl - Error while getting home page. Schema not set.");
    res.status(200);     
    res.json({status:messages.apiStatusError,message:messages.homepageBannerError});
  }};

  //Get home page category list
exports.getHomeCategory = function(req, res) {  
  // Set the client properties that came from the POST data
  if(req.decoded && req.decoded.schema)
  { 
    logger.info("ProductsControl - category for home page");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {        
        //Get the single selected product information.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_homecategory($1)";
        var paramsArr = [req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the home page category " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.homepageCategoryError});                  
                }
            }
            done(err);
        });
      }
    });
  }
  else
  {
    logger.error("ProductsControl - Error while getting home page category. Schema not set.");
    res.status(200);     
    res.json({status:messages.apiStatusError,message:messages.homepageCategoryError});
  }};

  //Get home page offers list
exports.getHomeOffer = function(req, res) {  
  // Set the client properties that came from the POST data
  if(req.decoded && req.decoded.schema)
  { 
    logger.info("ProductsControl - offer for home page");    
   
    conn.pgConnectionPool(function(err, clientConn, done)
    {    
      if(err)
      {        
        console.log("ProductsControl - Error while connection PG" + err);
        logger.error("ProductsControl - Error while connection PG" + err);
        res.status(200);                  
        res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
        done(err);
      }
      else
      {        
        //Get the single selected product information.
        var queryStr = "SELECT * from milkdelivery_master.sp_get_homeoffers($1)";
        var paramsArr = [req.decoded.schema];
        conn.pgSelectQuery(queryStr, paramsArr, clientConn, function(err, result){
            res.status(200);
            if(err)
            {
              logger.error("ProductsControl - Error while getting the home page offers " + err);
              res.json({status:messages.apiStatusError,message:messages.dbConnectionError});
            }
            else
            {
                //If record is available.
                if(result && result.rows && result.rows.length > 0)
                {
                  res.status(200);                  
                    res.json({status:messages.apiStatusSuccess, result:result.rows});  
                }
                else
                {             
                  res.status(200);
                  res.json({status:messages.apiStatusError,message:messages.homepageOfferError});                  
                }
            }
            done(err);
        });
      }
    });
  }
  else
  {
    logger.error("ProductsControl - Error while getting home page offers. Schema not set.");
    res.status(200);     
    res.json({status:messages.apiStatusError,message:messages.homepageOfferError});
  }};