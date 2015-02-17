'use strict';

var fs = require('fs');


function getFileName(req) {
	return req.fileName;
}

function readDataFromReq(req, callback) {
	var input = '';
	req.on('data', function(data) {
		input += data.toString('utf-8');
	});
	req.on('end', function() {
		callback(input);
	});
}

var headers = {'Content-Type': 'application/json'};

var methods = {
	POST: function(req, res) {
		var path = getFileName(req);
		fs.open(path, "wx", function(err) {
			if(err) {
				res.writeHead(404);
				res.end();
			} else {
				readDataFromReq(req, function(input) {
					fs.writeFile(path, input, function(err) {
						if (err) {
							res.writeHead(404);
						} else {
							res.writeHead(200, headers);
							res.write(input);
						}
						res.end();
					});
				});
			}
		}); 
	},

	PUT: function(req, res) {
		var path = getFileName(req);
		readDataFromReq(req, function(input) {
			fs.writeFile(path, input, function(err) {
				if (err) {
					res.writeHead(404);
				} else {
					res.writeHead(200, headers);
					res.write(input);
				}
				res.end();
			});
		});
	},

	GET: function(req, res) {
		var path = getFileName(req);
		fs.readFile(path, function(err, data) {
			if(err) {
				res.writeHead(404);
			} else {
				res.writeHead(200, headers);
				res.write(data);
			}
			res.end();
		});
	},

	DELETE: function(req, res) {
		var path = getFileName(req);
		fs.unlink(path, function(err) {
			res.writeHead(err ? 404 : 200);
			res.end();
		});
	},

	PATCH: function(req, res) {
		var path = getFileName(req);
		fs.open(path, 'r+', function(err) {
			if(err) {
				res.writeHead(404);
				res.end();
			} else {
				readDataFromReq(req, function(input) { 				
					input = JSON.parse(input);
					fs.readFile(path, function(err, data) {
						if(err) {
							res.writeHead(404);
							res.end();
						} else {
							var file = data.toString('utf8');
							file = JSON.parse(file);
							for (var key in input) {
								file[key] = input[key];
							}
							file = JSON.stringify(file);
							fs.writeFile(path, file, function(err) {
								if(err) {
									res.writeHead(404);
								} else {
									res.writeHead(200, headers);
									res.write(file);
								}
								res.end();
							});
						}
					});
				});
			}
		});
	}
};

module.exports = methods;
