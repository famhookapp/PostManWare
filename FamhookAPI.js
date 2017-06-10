var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var busboy = require('connect-busboy');
var rateLimit = require('express-rate-limit');
var userRoutes = require('./Router/UserRoutes.js');
var productRoutes = require('./Router/ProductRoutes.js');
var masterRoutes = require('./Router/MasterDataRoutes.js');
// var floatRoutes = require('./Router/FloatRoute.js');
// var relationRoutes = require('./Router/RelationRoute.js');
// var masterRoutes = require('./Router/MasterRoute.js');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require("./Logger.js");
var ejs = require('ejs');
var jwt = require('jsonwebtoken');
var messages = require('./GlobalMessages.js');
var app = express();
console.log("Initialize - Start");
logger.debug("Application initiating...");


app.use(busboy());

//app.set('trust proxy', 1);
//app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
 
var limiter = new rateLimit({
  windowMs: 5*60*1000, // 5 minutes 
  max: 100, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

//process.on('uncaughtException', function (err) {
//  console.log('Caught exception: ' + err);
//});

// Set view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
// parse application/json
app.use(bodyParser.json())
// Use the passport package in our application
app.use(passport.initialize());
// Use express session support since OAuth2orize requires it
var date = new Date();
var appendToExternalId = date.getDate()+"v"+date.getMonth()+"r"+date.getFullYear();

app.use(cookieParser());
app.use(session({  
  secret: appendToExternalId + messages.tokenSec,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: false,
        maxAge: 1000 * 60 * 24 // 24 hours 
  }
}));



app.use(limiter);
var apiRoutes = express.Router();

app.use('/api/member',userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/master',masterRoutes);

//var port = 80;
var port = 3000;

app.listen(port);
logger.debug("Application started at port " + port + ".. !!!");
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


//NEED TO UN-COMMENT IN PRODUCTION
process.on('uncaughtException', function (err) {
  console.log("Error " + err);
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  logger.debug("UncaughtException :: " + err);
  process.setMaxListeners(0);
  //process.exit(1);
});

  
  
 