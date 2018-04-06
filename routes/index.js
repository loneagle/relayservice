var express = require('express');
var router = express.Router();
const SQL = require('../models/SQL');
const Device = require('../routes/udpsocket');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	SQL.getUserDevices(req.user.idUsers,function(devices){
		for (let i in devices)
		Device.sendReqStatus(devices[i].ip,devices[i].port);
		res.render('index', {
			title: 'Devices',
			devices:devices
		});
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
