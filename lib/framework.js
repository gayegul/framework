'use strict';

var http = require('http');
var methods = require('./methods.js');
var fs = require('fs');

var resources = [];
var srv;

module.exports = {
	addResource: function(resourceName) {
		resources.push(resourceName);
	},
	start: function(port, callback) {
		resources.forEach(function(r) {
			try {
				fs.mkdirSync('./data/' + r);
			} catch(err) {}
		});
		var server = http.createServer(function(req, res) {
			var pathBits = req.url.split('/');
			if(resources.indexOf(pathBits[1]) != -1) {
			    var id = pathBits[pathBits.length-1];
			    var path = './data/' + pathBits[1] + '/' + id + '.json';
			    req.fileName = path;
			    methods[req.method](req, res);
			} else {
				res.writeHead(404, {
					'Content-Type': 'application/json'
				});
				var errorMessage = JSON.stringify({msg: 'page not found'});
				res.write(errorMessage);
				res.end();
			}
		});
		srv = server;
		server.listen(port, function() {
			console.log("server started");
			if (callback) {
				callback(server);
			}
		});
	},
	getServer: function() {
		return srv;
	}
};



