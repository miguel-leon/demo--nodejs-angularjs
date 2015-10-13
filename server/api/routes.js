'use strict';

var authentication = require('./authentication');

// variable <express> is already set in the global scope at this point.
//var express = require('express');
var router = express.Router();

function returnPublicConfig(req, res) {
	res.json(CONFIG["public"])
}

router.get('/', returnPublicConfig);
router.get('/config', returnPublicConfig);

// Attempt login, verify credentials.
router.post('/authenticate', authentication.attempt);

router.post('/user', function (req, res) {
	try {
		delete req.body.id; // in case of client hacked
		var user = providers.database.Users.save(req.body);
	}
	catch (err) {
		err.success = false;
		err.user = null;
		return res.json(err);
	}
	res.json({success: true, user: user});
});

// Verify authentication token before further access to the API.
router.use(authentication.restrict);

// Get the list of users.
router.get('/user_list', function (req, res) {
	var users = providers.database.Users.list();
	res.json({success: true, users: users});
});

// Get a single user data.
router.get('/user/:id', function (req, res) {
	var user = providers.database.Users.find({id: req.params.id});
	if (!user) res.json({success: false, user: null, nonexistentUser: true});
	else res.json({success: true, user: user});
});

// Put data to modify an existing user in database.
router.put('/user', function (req, res) {
	try {
		req.body.id = req.body.id || '-'; // in case of client hacked
		var user = providers.database.Users.save(req.body);
	}
	catch (err) {
		err.success = false;
		err.user = null;
		return res.json(err);
	}
	if (!user) res.json({success: false, user: null, nonexistentUser: true});
	else res.json({success: true, user: user});
});

// Delete an existing user in database. Must have different id than the authenticated user.
router.delete('/user/:id', function (req, res) {
	if (req.params.id == req.decoded.id) return res.json({success:false, unableToDelete: true});
	var user = providers.database.Users.delete({id: req.params.id});
	if (!user) return res.json({success:false, nonexistentUser: true});
	res.json({success: true});
});



router.use('/who', function (req, res) {
	res.json({ message: 'API accessed.', auth: req.decoded });
});

router.use(returnPublicConfig);

// returns a router
module.exports = router;
