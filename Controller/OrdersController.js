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

//Get all the daily order options item
exports.getOrderOptions = function (req, res) {
    // Set the client properties that came from the POST data   
    logger.info("OrdersControl - options list");

    conn.pgConnectionPool(function (err, clientConn, done) {
        if (err) {
            console.log("OrdersControl - Error while connection PG" + err);
            logger.error("OrdersControl - Error while connection PG" + err);
            res.status(200);
            res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
            done(err);
        }
        else {
            //Get the order options list like weekly, monthly etc.
            var queryStr = "SELECT * from milkdelivery_master.sp_get_dailyoptions()";
            var paramsArr = [];
            conn.pgSelectQuery(queryStr, paramsArr, clientConn, function (err, result) {
                res.status(200);
                if (err) {
                    logger.error("OrdersControl - Error while getting the order options list " + err);
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
                        res.json({ status: messages.apiStatusError, message: messages.orderOptionListError });
                    }
                }
                done(err);
            });
        }
    });
};

//Cart Add: Add details to the cart parent table. User Id and Schema.
exports.addToCartProducts = function (req, res) {
    // Set the client properties that came from the POST data
    if (req.body && req.body.productid && req.body.quantity && req.body.isdailyservice && req.decoded && req.decoded.uid && req.decoded.schema) {
        logger.info("OrdersControl - User cart products details");
        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("OrdersControl - Error while connection PG" + err);
                logger.error("OrdersControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Insert the values in the cart parent table only.
                var queryStr = "SELECT * FROM milkdelivery_master.sp_insert_addcartparent($1,$2);";
                var paramsArr = new Array(req.decoded.uid, req.decoded.schema);
                conn.pgExecuteQuery(queryStr, paramsArr, clientConn, function (err, resultParent) {
                    res.status(200);
                    if (err) {
                        logger.error("OrdersControl - Error while adding cart info " + err);
                        res.json({ status: messages.apiStatusError, message: messages.cartErrorMessage });
                    }
                    else {
                        //If record is saved successfully.
                        if (resultParent && resultParent.rows && resultParent.rows.length > 0) {
                            if (resultParent.rows[0]['sp_insert_addcartparent'] == "0") {
                                res.status(200);
                                res.json({ status: messages.apiStatusError, message: messages.cartErrorMessage });
                            }
                            else {
                                var cartId = resultParent.rows[0]['sp_insert_addcartparent'];
                                //Insert the values in the cart products table. Cart id from parent table.
                                var queryStr = "SELECT * FROM milkdelivery_master.sp_insert_addcartproducts($1,$2,$3,$4,$5);";
                                var paramsArr = new Array(cartId, req.body.productid, req.body.quantity, req.body.isdailyservice, req.decoded.schema);
                                conn.pgExecuteQuery(queryStr, paramsArr, clientConn, function (err, result) {
                                    res.status(200);
                                    if (err) {
                                        logger.error("OrdersControl - Error while adding user info " + err);
                                        res.json({ status: messages.apiStatusError, message: messages.userInfoAddError });
                                    }
                                    else {
                                        //If record is saved successfully.
                                        if (result && result.rows && result.rows.length > 0) {
                                            if (result.rows[0]['sp_insert_addcartproducts'] == "0") {
                                                res.status(200);
                                                res.json({ status: messages.apiStatusError, message: messages.cartErrorMessage });
                                            }
                                            else {
                                                res.status(200);
                                                res.json({ status: messages.apiStatusSuccess, result: result.rows });
                                            }
                                        }
                                        else {
                                            res.status(200);
                                            res.json({ status: messages.apiStatusError, message: messages.cartErrorMessage });
                                        }
                                    }
                                    done(err);
                                });
                            }
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.cartErrorMessage });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("OrdersControl - Add cart : Missing data fields");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.reloginMessage });
    }
};

//Cart Count: Get the current cart count. User Id and Schema.
exports.getCartCount = function (req, res) {
    // Set the client properties that came from the POST data
    if (req.decoded && req.decoded.uid && req.decoded.schema) {
        logger.info("OrdersControl - User cart count");
        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("OrdersControl - Error while connection PG" + err);
                logger.error("OrdersControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Get total cart count.
                var queryStr = "SELECT * FROM milkdelivery_master.sp_get_usercartcount($1,$2);";
                var paramsArr = new Array(req.decoded.uid, req.decoded.schema);
                conn.pgExecuteQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("OrdersControl - Error while getting cart count " + err);
                        res.json({ status: messages.apiStatusError, message: messages.cartCountErrorMessage });
                    }
                    else {
                        //If record is saved successfully.
                        if (result && result.rows && result.rows.length > 0) {                            
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });                            
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.cartCountErrorMessage });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("OrdersControl - Cart count : Missing data fields");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.reloginMessage });
    }
};

//Cart Remove: Remove product (one product at a time) from the cart.
exports.removeCartProduct = function (req, res) {
    // Set the client properties that came from the POST data
    if (req.body && req.body.productid && req.body.cartid && req.decoded && req.decoded.schema) {
        logger.info("OrdersControl - User remove cart product");
        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("OrdersControl - Error while connection PG" + err);
                logger.error("OrdersControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Insert the values in the cart parent table only.
                var queryStr = "SELECT * FROM milkdelivery_master.sp_delete_removecartproduct($1,$2,$3);";
                var paramsArr = new Array(req.body.cartid, req.body.productid, req.decoded.schema);
                conn.pgExecuteQuery(queryStr, paramsArr, clientConn, function (err, resultParent) {
                    res.status(200);
                    if (err) {
                        logger.error("OrdersControl - Error while removing product from cart " + err);
                        res.json({ status: messages.apiStatusError, message: messages.cartRemoveErrorMessage });
                    }
                    else {
                        //If record is saved successfully.
                        if (resultParent && resultParent.rows && resultParent.rows.length > 0) {
                            if (resultParent.rows[0]['sp_delete_removecartproduct'] == "0") {
                                res.status(200);
                                res.json({ status: messages.apiStatusError, message: messages.cartRemoveErrorMessage });
                            }
                            else {                                
                                res.status(200);
                                res.json({ status: messages.apiStatusSuccess, result: result.rows });                                           
                            }
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.cartRemoveErrorMessage });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("OrdersControl - Add cart : Missing data fields");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.reloginMessage });
    }
};

//Cart Count: Get the current cart summary. User Id and Schema.
exports.getCartUserSummary = function (req, res) {
    // Set the client properties that came from the POST data
    if (req.decoded && req.decoded.uid && req.decoded.schema) {
        logger.info("OrdersControl - User cart summary");
        conn.pgConnectionPool(function (err, clientConn, done) {
            if (err) {
                console.log("OrdersControl - Error while connection PG" + err);
                logger.error("OrdersControl - Error while connection PG" + err);
                res.status(200);
                res.json({ status: messages.apiStatusError, message: messages.dbConnectionError });
                done(err);
            }
            else {
                //Get total cart  summary.
                var queryStr = "SELECT * FROM milkdelivery_master.sp_get_usercartsummary($1,$2);";
                var paramsArr = new Array(req.decoded.uid, req.decoded.schema);
                conn.pgExecuteQuery(queryStr, paramsArr, clientConn, function (err, result) {
                    res.status(200);
                    if (err) {
                        logger.error("OrdersControl - Error while getting cart summary " + err);
                        res.json({ status: messages.apiStatusError, message: messages.cartSummaryErrorMessage });
                    }
                    else {
                        //If record is saved successfully.
                        if (result && result.rows && result.rows.length > 0) {                            
                            res.status(200);
                            res.json({ status: messages.apiStatusSuccess, result: result.rows });                            
                        }
                        else {
                            res.status(200);
                            res.json({ status: messages.apiStatusError, message: messages.cartSummaryErrorMessage });
                        }
                    }
                    done(err);
                });
            }
        });
    }
    else {
        logger.error("OrdersControl - Cart summary : Missing data fields");
        res.status(200);
        res.json({ status: messages.apiStatusError, message: messages.reloginMessage });
    }
};
