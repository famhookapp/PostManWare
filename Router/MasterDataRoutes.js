var express = require('express');
var jwt = require('jsonwebtoken');
var masterController = require('../Controller/MasterDataController.js');
var messages = require('../GlobalMessages.js');
var commonRoute = require('./CommonRoutes.js');

var router = express.Router();

router.use(function(req,res,next){
// check header or url parameters or post parameters for token  
  commonRoute.verifyTokenValidity(req,res,next);
});

//All the API needs the token to be passed.
router.get('/',function(req,res){res.status(400), res.json({message:messages.wrongApiUrl})});
router.post('/countrylist',masterController.getCountryList); //Registration : Get all countries.
router.post('/statelist',masterController.getStateList); //Registration : Get all states.
router.post('/citylist',masterController.getCityList); //Registration : Get all cities.
router.post('/arealist',masterController.getAreaList); //Registration : Get all area list.
router.post('/brandlist',masterController.getBrandList); //Registration : Get all brands.
router.post('/categorylist',masterController.getCategoryList); //Registration : Get all category.
router.post('/sortbylist',masterController.getSortbyList); //Registration : Get all sortby.
router.post('/statuslist',masterController.getStatusList); //Registration : Get all status.

module.exports = router;