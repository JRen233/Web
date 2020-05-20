// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

var errorFlag = 'cor';

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9396, () => console.log('Listening on port 9396!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact',function(req, res) {
  if(req.session.value === 0 || req.session.value === undefined) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    res.sendFile(__dirname + '/client/contact.html', function(err) {
      if(err) throw err;
    });
  }
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact',function(req, res) {
  if(req.session.value === 0 || req.session.value === undefined) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    res.sendFile(__dirname + '/client/addContact.html', function(err) {
      if(err) throw err;
    });
  }
});
//GET method for stock page
app.get('/stock', function (req, res) {
  if(req.session.value === 0 || req.session.value === undefined) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    res.sendFile(__dirname + '/client/stock.html', function(err) {
      if(err) throw err;
    });
  }
});

app.get('/index', function (req, res) {
  if(req.session.value === 0 || req.session.value === undefined) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    res.sendFile(__dirname + '/client/index.html', function(err) {
      if(err) throw err;
    });
  }
});

// GET method route for the login page.
//It serves login.html present in client folder
app.get('/login',function(req, res) {
  res.sendFile(__dirname + '/client/login.html', function(err) {
    if(err) throw err;
  });
  // Add Details
});

app.get('/getflag', function(req, res) {
  res.status(200).send(errorFlag);
  errorFlag = "cor";
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts and sends the response back to client
app.get('/getListOfContacts', function(req, res) {
  //Add Details
  var connection = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U47", // replace with the database user provided to you
    password: "2239", // replace with the database password provided to you
    database: "C4131S20U47", // replace with the database user provided to you
    port: 3306
  });

  if(connection.state === 'disconnected') {
    connection.connect(function(err) {
      if(err) throw err;
      console.log("connected to database");
    });
  }

  if(req.session.value === 0 || req.session.value === undefined) {
    res.sendFile(__dirname + '/client/login.html');
  } else {
    var sql = "SELECT * FROM tbl_contacts";
    connection.query(sql, function(err, result) {
      if (err) throw err;
      if (result.length == 0) {
        console.log("Empty");
      } else {
        res.send(result);
      }
    });
  }

});

//POST method to insert details of a new contact to tbl_contacts table
app.post('/postContact', function(req, res) {
  //Add Details
  var connection = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U47", // replace with the database user provided to you
    password: "2239", // replace with the database password provided to you
    database: "C4131S20U47", // replace with the database user provided to you
    port: 3306
  });

  if(connection.state === 'disconnected') {
    connection.connect(function(err) {
      if(err) throw err;
      console.log("connected to database");
    });
  }

  var rowToBeInserted = {
    contact_name: req.body.contactName,
    contact_email: req.body.email,
    contact_address: req.body.address,
    contact_phone: req.body.phoneNumber,
    contact_favoriteplace: req.body.favoritePlace,
    contact_favoriteplaceurl: req.body.favoritePlaceURL
  };
  // var sql = 'INSERT INTO tbl_contacts (contact_name, contact_email,contact_address,' +
  //   'contact_phone,contact_favoriteplace,contact_favoriteplaceurl) VALUES ' +
  connection.query('INSERT tbl_contacts SET ?', rowToBeInserted, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });
  res.redirect("/contact");
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  //Add Details
  var username = "'"+req.body.Username+"'";
  var passward = crypto.createHash('sha256').update(req.body.Password).digest('base64');

  var connection = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U47", // replace with the database user provided to you
    password: "2239", // replace with the database password provided to you
    database: "C4131S20U47", // replace with the database user provided to you
    port: 3306
  });

  if(connection.state === 'disconnected') {
    connection.connect(function(err) {
      if(err) throw err;
      console.log("connected to database");
    });
  }
  connection.query('SELECT * FROM tbl_accounts WHERE acc_login = ' + username , function(err, rows) {
    if(err) throw err;
    if(rows.length == 0) {
      console.log('No entris in tbl_accounts');
      errorFlag = "err";
      req.session.value = 0;
      res.redirect("/login");
    } else {
      if (rows[0].acc_password === passward) {
        console.log("success");
        errorFlag = 'cor';
        req.session.value = 1;
        res.redirect("/contact");
      } else {
        console.log("fail");
        console.log(rows[0].acc_password);
        console.log(passward);
        errorFlag = 'err';
        req.session.value = 0;
        res.redirect("/login");
      }
    }
  });
});


// log out of the application
// destroy user session

app.get('/logout', function(req, res) {
  if(!req.session.value) {
		res.redirect("/login");
	} else {
		console.log ("Successfully Destroyed Session!");
		req.session.destroy();
		res.redirect("/login");
	}
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  //add details
  res.status(404);
  res.send();
});
