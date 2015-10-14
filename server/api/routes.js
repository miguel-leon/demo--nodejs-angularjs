'use strict';

// Following variables must be set in the global scope at this point.
// var express = require('express');
// var path = require('path');

var authentication = require('./authentication'); // authentication middlewares
var api = require('./api'); // API middlewares
var router = express.Router();

  //==============================//
 //            ROUTES            //
//==============================//
/** Middleware for public description of the API */
router.get('/', returnDescription);
router.get('/config', returnDescription);
/** Middleware for Attempting login, verify credentials */
router.post('/authenticate', authentication.attempt);
/** Middleware for creating new user */
router.post('/user', api.createUser);
/** Middleware for verifying authentication before further access to the API */
router.use(authentication.restrict);
/** Middleware for retrieving the list of users */
router.get('/user_list', api.getUserList);
/** Middleware for retrieving a single user data */
router.get('/user/:id', api.getUser);
/** Middleware to modify an existing user */
router.put('/user', api.updateUser);
/** Middleware for deleting an existing user in database. Must be other than the authenticated user */
router.delete('/user/:id', api.deleteUser);
/** Middleware for retrieving the list of profiles */
router.get('/profiles', api.getProfiles);
/** Middleware for retrieving the list of holdings */
router.get('/holdings', api.getHoldings);
/** Testing API with logged user */
router.use('/who', function (req, res) {
	res.json({ message: 'API accessed.', auth: req.decoded });
});
/** Middleware for any other unhandled route */
router.use(returnDescription);


  //==============================//
 //        EXPORT ROUTER         //
//==============================//
module.exports = router;


  //==============================//
 //      HOISTED FUNCTIONS       //
//==============================//
function returnDescription(req, res) {
	res.sendFile(path.join(__dirname, 'description.json'));
}
