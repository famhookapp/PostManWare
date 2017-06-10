var express = require('express');
var jwt = require('jsonwebtoken');
var productController = require('../Controller/ProductsController.js');
var messages = require('../GlobalMessages.js');
var commonRoute = require('./CommonRoutes.js');

var router = express.Router();

router.use(function(req,res,next){
// check header or url parameters or post parameters for token  
  commonRoute.verifyTokenValidity(req,res,next);
});

//All the API needs the token to be passed.
router.get('/',function(req,res){res.status(400), res.json({message:messages.wrongApiUrl})});
router.post('/prodlist',productController.getProducts); //Login User params:searchkey,orderby,brandid,categoryid;
router.post('/singleproduct',productController.getSingleProduct); //Login User params:productid;
router.post('/homepagebanner',productController.getHomeAdBanners); 
router.post('/homepagecategory',productController.getHomeCategory); 
router.post('/homepageoffer',productController.getHomeOffer); 

module.exports = router;