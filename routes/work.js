const express = require('express');
const router = express.Router();
const SQL = require('../models/SQL');
const Device = require('../routes/udpsocket');

router.get('/adddevice', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('adddevice', {
      title: 'Add device',
      goalname: "Save"
    });
  } else {
    req.flash('error_msg', 'You are not in login');
    res.redirect('/SQLs/login');
  }
});

router.post('/eddevice', function(req, res) {
  if (req.isAuthenticated()) {
    SQL.getDeviceById(req.body.button, function(row) {
      res.render('adddevice', {
        title: 'Add device',
        goal: row.idDevices,
        goalname: "Edit",
        device: row
      });
    });
  } else {
    req.flash('error_msg', 'You are not in login');
    res.redirect('/SQLs/login');
  }
});

router.post('/turn', function(req, res) {
  if (req.isAuthenticated()) {
    SQL.getDeviceById(req.body.button, function(device) {
      Device.sendOrder('send', device.port, device.ip);
    });
    res.redirect('/');
  } else {
    req.flash('error_msg', 'You are not in login');
    res.redirect('/SQLs/login');
  }
});

router.post('/deldevice', function(req, res) {
  if (req.isAuthenticated()) {
    SQL.deleteDevice(req.body.delete, function(err, info) {
      if (err) throw err;
    });
    req.flash('success_msg', 'Success delete');
    res.redirect('/');
  } else {
    req.flash('error_msg', 'Вхід не виконано');
    res.redirect('/users/login');
  }
});


router.post('/adddevice', function(req, res) {
  if (req.isAuthenticated()) {
    let Device = {
      name: req.body.name,
      place: req.body.place,
      ip: req.body.ip,
      port: Number(req.body.port)
    };
    if (!req.body.button) {
      console.log(Device);
      SQL.addDevice(req.user.idUsers, Device, function(err) {
        if (err) throw err;
      });
    } else {
      SQL.editDevice(req.body.button, Device, function(err) {
        if (err) throw err;
      });
    }
    req.flash('success_msg', 'Success operation');
    res.redirect('/');
  } else {
    req.flash('error_msg', 'You are not in login');
    res.redirect('/users/login');
  }
});

module.exports = router;
