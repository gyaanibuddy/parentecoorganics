'use strict';
let jwt = require('jwt-simple');
let moment = require('moment');
let config = require( '../config')
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
	function ensureAuthenticated(req, res, next) {
		if (!req.header('Authorization')) {
			return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
		}
		var token = req.header('Authorization').split(' ')[1];

		var payload = null;
		try {
			payload = jwt.decode(token, config.TOKEN_SECRET);
			console.log(payload)
		}
		catch (err) {
			return res.status(401).send({ message: err.message });
		}

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({ message: 'Token has expired' });
		}
		req.user = payload.sub;
		next();
	}

module.exports = ensureAuthenticated ;
