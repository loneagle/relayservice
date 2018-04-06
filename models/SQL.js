const mysql = require('mysql');
const bcrypt = require('bcryptjs');

let db = 'relayservice';

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'q',
});

let users = ('CREATE TABLE IF NOT EXISTS `Users` (`idUsers` INT NOT NULL AUTO_INCREMENT,`name` VARCHAR(45) NOT NULL, `email` VARCHAR(45) NOT NULL, `password` VARCHAR(255) NOT NULL, PRIMARY KEY (`idUsers`), UNIQUE INDEX `idUsers_UNIQUE` (`idUsers` ASC)) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8');
let devices = ('CREATE TABLE IF NOT EXISTS `Devices` (`idDevices` INT NOT NULL AUTO_INCREMENT,`name` VARCHAR(45) NOT NULL,`place` VARCHAR(45) NULL,`ip` VARCHAR(45) NOT NULL,`port` INT NOT NULL,`Users_idUsers` INT NOT NULL,PRIMARY KEY (`idDevices`),UNIQUE INDEX `idDevices_UNIQUE` (`idDevices` ASC),INDEX `fk_Devices_Users_idx` (`Users_idUsers` ASC), CONSTRAINT `fk_Devices_Users` FOREIGN KEY (`Users_idUsers`) REFERENCES `relayservice`.`Users` (`idUsers`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8');

connection.connect(function(err) {
  if (!err) {
    console.log("Database is connected");
    connection.query('CREATE DATABASE IF NOT EXISTS ??', db, function(err, results) {
      if (err) {
        console.log('error in creating database', err);
        return;
      }
      console.log('database has been selected or created');
      connection.changeUser({
        database: db
      }, function(err) {
        if (err) {
          console.log('error in changing database', err);
          return;
        }
        createtable(users, 'Users');
        createtable(devices, 'Devices');
      });
    });
  } else {
    console.log("Error connecting database");
  }
});

function createtable(sql, name) {
  connection.query(sql, function(err) {
    if (err) {
      console.log('error in creating tables', err);
      return;
    }
    console.log('table ' + name + ' has been selected or created');
  });
}

let User = module.exports;

//User

module.exports.createUser = function(newUser, callback) {
  let sql = "INSERT INTO Users(name,email,password) VALUES ?";
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      let modUser = [
        [newUser.name, newUser.email, newUser.password]
      ];
      connection.query(sql, [modUser], function(err, result) {
        if (err) throw err;
      });
    });
  });
};

module.exports.getUserByUsername = function(name, callback) {
  connection.query("SELECT * FROM Users where name=?", [name], function(err, result) {
    if (err) throw err;
    callback(null, result[0]);
  });
};

module.exports.getUserById = function(id, callback) {
  connection.query("SELECT * FROM Users where idUsers=?", id, function(err, result) {
    if (err) throw err;
    callback(err, result[0]);
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.addDevice = function(idUsers, device, callback) {
  connection.query("INSERT INTO Devices (name,place,ip,port,Users_idUsers) VALUES (?,?,?,?,?)", [device.name,device.place,device.ip,device.port,idUsers], function(err, result) {
    if (err) throw err;
  });
};

module.exports.getUserDevices = function(idUsers, callback) {
  connection.query("SELECT * FROM Devices where Users_idUsers=?", idUsers, function(err, result) {
    if (err) throw err;
    callback(result);
  });
};

module.exports.deleteDevice = function(idDevices, callback) {
  connection.query("DELETE FROM Devices where idDevices=?", idDevices, function(err, result) {
    if (err) throw err;
  });
};

module.exports.getDeviceById = function(idDevices, callback) {
  connection.query("SELECT * FROM Devices where idDevices=?", Number(idDevices), function(err, result) {
    if (err) throw err;
    callback(result[0]);
  });
};

module.exports.editDevice = function(idDevices, device, callback) {
  connection.query("UPDATE Devices SET name = ?,place = ?,ip = ?,port = ? WHERE idDevices = ?", [device.name, device.place, device.ip, Number(device.port), Number(idDevices)], function(err, result) {
    if (err) throw err;
  });
};
module.exports.editDeviceStatus = function(idDevices, device) {
  connection.query("UPDATE Devices SET status = ? WHERE idDevices = ?", [status,idDevices], function(err) {
    if (err) throw err;
  });
};
