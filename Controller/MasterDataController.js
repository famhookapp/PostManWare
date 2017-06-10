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

//Get list of country
exports.getCountryList = function (req, res) {
    //Set the client properties that came from the POST data

    logger.info("MasterDataControl - Country list");

    conn.pgConnectionPool(function (err, clientConn, done) {
        if (err) {
            console.log("MasterDataControl - Error while connection PG" + err);
            logger.error("MasterDataControl - Error while connection PG" + err);
            res.status(200);
            res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
            done(err);
        }
        else {
            //Get the list of countries.
            var queryStr = "SELECT * from milkdelivery_master.sp_get_country()";
            var paramsArr = [];
            conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                res.status(200);
                if (err) {
                    logger.error("MasterDataControl - Error while getting the country list " + err);
                    res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                }
                else {
                    //If record is available.
                    if (result && result.rows && result.rows.length > 0) {
                        res.status(200);
                        res.json({ status: messages.apiStatusSuccess, result: result.rows });
                    }
                    else {
                        res.status(200);
                        res.json({ status: messages.apiStatusError, message: messages.masterDataCountryError });
                    }
                }
                done(err);
            });
        }
    });
};

//Get list of state
exports.getStateList = function (req, res) {
    //Set the client properties that came from the POST data

    if (req.body && req.body.countryid && !isNaN(req.body.countryid)) {
        logger.info("MasterDataControl - State list");

        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("MasterDataControl - Error while connection PG" + err);
                logger.error("MasterDataControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Get the list of state.
                var queryStr = "SELECT * from milkdelivery_master.sp_get_state($1)";
                var paramsArr = [req.body.countryid];
                conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("MasterDataControl - Error while getting the state list " + err);
                        res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                    }
                    else {
                        //If record is available.
                        if (result && result.rows && result.rows.length > 0) {
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.masterDataStateError });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("MasterDataControl - country id not set");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.materDataCountryIdError });
    }
};
//Get list of city
exports.getCityList = function (req, res) {
    //Set the client properties that came from the POST data

    if (req.body && req.body.stateid && !isNaN(req.body.stateid)) {
        logger.info("MasterDataControl - City list");

        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("MasterDataControl - Error while connection PG" + err);
                logger.error("MasterDataControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Get the list of city.
                var queryStr = "SELECT * from milkdelivery_master.sp_get_city($1)";
                var paramsArr = [req.body.stateid];
                conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("MasterDataControl - Error while getting the city list " + err);
                        res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                    }
                    else {
                        //If record is available.
                        if (result && result.rows && result.rows.length > 0) {
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.masterDataCityError });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("MasterDataControl - state id not set");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.materDataStateIdError });
    }
};
//Get list of area
exports.getAreaList = function (req, res) {
    //Set the client properties that came from the POST data   
    if (req.body && req.body.cityid && !isNaN(req.body.cityid)) {
        logger.info("MasterDataControl - Area list");

        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("MasterDataControl - Error while connection PG" + err);
                logger.error("MasterDataControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Get the list of area.
                var queryStr = "SELECT * from milkdelivery_master.sp_get_area($1)";
                var paramsArr = [req.body.cityid];
                conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("MasterDataControl - Error while getting the area list " + err);
                        res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                    }
                    else {
                        //If record is available.
                        if (result && result.rows && result.rows.length > 0) {
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.masterDataAreaError });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("MasterDataControl - city id not set");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.materDataCityIdError });
    }
};
//Get list of brand
exports.getBrandList = function (req, res) {
    //Set the client properties that came from the POST data
    if (req.decoded && req.decoded.schema) {
        logger.info("MasterDataControl - Country list");

        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("MasterDataControl - Error while connection PG" + err);
                logger.error("MasterDataControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                var categoryId =(req.body.categoryid) ? req.body.categoryid : 0;
                //Get the list of brand.
                var queryStr = "SELECT * from milkdelivery_master.sp_get_brandlist($1, $2)";
                var paramsArr = [categoryId, req.decoded.schema];
                conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("MasterDataControl - Error while getting the brand list " + err);
                        res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                    }
                    else {
                        //If record is available.
                        if (result && result.rows && result.rows.length > 0) {
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.masterDataBrandError });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else
    {
        logger.error("MasterDataControl - schema not set for brand list");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.masterDataBrandError });
    }
};
//Get list of category
exports.getCategoryList = function (req, res) {
    //Set the client properties that came from the POST data
if (req.decoded && req.decoded.schema) {
    
    logger.info("MasterDataControl - category list");

    conn.pgConnectionPool(function (err, clientConn, done) {
        if (err) {
            console.log("MasterDataControl - Error while connection PG" + err);
            logger.error("MasterDataControl - Error while connection PG" + err);
            res.status(200);
            res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
            done(err);
        }
        else {
            //Get the list of categories.
            var queryStr = "SELECT * from milkdelivery_master.sp_get_categorylist($1)";
            var paramsArr = [req.decoded.schema];
            conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                res.status(200);
                if (err) {
                    logger.error("MasterDataControl - Error while getting the category list " + err);
                    res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                }
                else {
                    //If record is available.
                    if (result && result.rows && result.rows.length > 0) {
                        res.status(200);
                        res.json({ status: messages.apiStatusSuccess, result: result.rows });
                    }
                    else {
                        res.status(200);
                        res.json({ status: messages.apiStatusError, message: messages.masterDataCategoryError });
                    }
                }
                done(err);
            });
        }
    });
}
 else
    {
        logger.error("MasterDataControl - schema not set for category list");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.masterDataCategoryError });
    }
};
//Get list of sortby
exports.getSortbyList = function (req, res) {
    //Set the client properties that came from the POST data

    logger.info("MasterDataControl - Sort order");
    res.status(200);
    res.json({
        status: messages.apiStatusSuccess, result: {
            "orderlist": [
                { "name": "Product Name", "value": "product_name"},{"name": "Price", "value": "amount" }]
        }
    });
};


