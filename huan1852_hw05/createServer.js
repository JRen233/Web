const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/contact.html'){
    contactPage(req,res);
  }
  else if(req.url === '/addContact.html'){
    addContactPage(req,res);
  }
  else if(req.url === '/stock.html'){
    stockPage(req,res);
  }
  else if(req.url === '/getContact') {
    contactJsonPage(req,res);
  }
  else if(req.url === '/postContactEntry') {
    var reqBody = '';
    // server starts receiving the form data
    req.on('data', function(data) {
      reqBody+= data;
    });// server has received all the form data
    req.on('end', function() {
      //code to add info in reqBody to file contacts.json(may want function that take req, res, reqBody)
      addContactInformation(req, res, reqBody);
    });
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9001);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

  function contactPage(req, res) {
    fs.readFile('client/contact.html', function(err, html) {
      if(err) {
        throw err;
      }
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      res.write(html);
      res.end();
  });
}

  function addContactPage(req, res) {
    fs.readFile('client/addContact.html', function(err, html) {
      if(err) {
        throw err;
      }
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      res.write(html);
      res.end();
  });
}

  function stockPage(req, res) {
    fs.readFile('client/stock.html', function(err, html) {
      if(err) {
        throw err;
      }
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      res.write(html);
      res.end();
  });
}

function contactJsonPage(req, res) {
  fs.readFile('./contact.json', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function addContactInformation(req, res, reqBody) {
  const qs = require('querystring');
  var postObj = qs.parse(reqBody);

  var name = postObj.contactName;
  var email = postObj.email;
  var address = postObj.address;
  var phoneNumber = postObj.phoneNumber;
  var favoritePlace = postObj.favoritePlace;
  var favoritePlaceURL = postObj.favoritePlaceURL;

  var  jsonObj= {};
  jsonObj["name"] = name;
  jsonObj['email'] = email;
  jsonObj['address'] = address;
  jsonObj['phoneNumber'] = phoneNumber;
  jsonObj['favoritePlace'] = favoritePlace;
  jsonObj['favoritePlaceURL'] = favoritePlaceURL;

  //Read in the contact.jsonfile, store in variable named (fileJsonString)
  fs.readFile('contact.json', function(err, fileJsonString) {
    if(err) {
      throw err;
    }
    var fileJson = JSON.parse(fileJsonString);// objectify the string
    // console.log(fileJson);

    //next, appendjsonObj onto end of array in fileJson
    fileJson.contact.push(jsonObj);

    //stringify fileJson intofileJsonString
    var intofileJsonString = JSON.stringify(fileJson);
    // console.log("\n");
    // console.log(intofileJsonString);

    // write back to contact.json
    fs.writeFile('contact.json', intofileJsonString, function (err) {
      if (err) throw err;
      //console.log('Replaced!');
    });
  });
  //redirect
  res.writeHead(302,{'Location':'/contact.html'});
  res.end();
}
