var express = require('express');
var jwt = require('jsonwebtoken');
var orderController = require('../Controller/OrdersController.js');
var messages = require('../GlobalMessages.js');
var commonRoute = require('./CommonRoutes.js');

var router = express.Router();

router.use(function(req,res,next){
// check header or url parameters or post parameters for token  
  commonRoute.verifyTokenValidity(req,res,next);
});

//All the API needs the token to be passed.
router.get('/',function(req,res){res.status(400), res.json({message:messages.wrongApiUrl})});
router.post('/orderoptions',orderController.getOrderOptions); //Login User params:searchkey,orderby,brandid,categoryid;
router.post('/puttocart',orderController.addToCartProducts); //Login User params:productid;
router.post('/cartitems',orderController.getCartCount); //Delivery options masterdata;
router.post('/deletecartprod',orderController.removeCartProduct); 
router.post('/usercart',orderController.getCartUserSummary); 

module.exports = router;