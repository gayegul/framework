'use strict';

var framework = require('../lib/framework.js');
var chai = require('chai');
var chaihttp = require('chai-http');
var merge = require('merge');
var expect = chai.expect;
chai.use(chaihttp);


var testFolder = 'folder' + (10000 + Math.random() * 10000);

var expected = '{ "idNum" : "test" }';
var getRandResName = function() {
	return '/' + testFolder + '/' + (10000 + Math.random() * 10000);
};

describe('framework tests', function() {

	var resource = getRandResName();
	var server;

	before(function(done) {
		framework.addResource(testFolder);
		framework.start(3000, function(srv){
			server = srv;
			done();
		});
	});

	describe('put', function(done) {
		it('should create a new file', function(done) {
			chai.request(server)
			.put(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				done();
			});
		});
	});
	
	describe('get', function() {	
		it('should not find file', function(done) {
			chai.request(server)
			.get('/magic/doesNotExist')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'page not found'});
				done();
			});
		});
		it('should get 404', function(done) {
			chai.request(server)
			.get('/' + testFolder + '/doesNotExist')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				done();
			});
		});
		it('should get the resource', function(done) {
			chai.request(server)
			.get(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
	});

	describe('post', function() {
		it('should fail overwriting an existing file', function(done) {
			chai.request(server)
			.post(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				done();
			});
		});
		it('should create a new file', function(done) {
			chai.request(server)
			.post(getRandResName())
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
	});

	describe('patch', function() {
		it('should err file not found', function(done) {
			chai.request(server)
			.patch(getRandResName())
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				done();
			});
		});
		it('should not change the file', function(done) {
			chai.request(server)
			.patch(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
		it('should patch the file', function(done) {
			var newProp = {"name" : "burton"};
			var result = merge(JSON.parse(expected), newProp);
			chai.request(server)
			.patch(resource)
			.send(JSON.stringify(newProp))
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(result);
				done();
			});
		});
	});

	describe('delete', function() {
		it('should delete the file', function(done) {
			chai.request(server)
			.del(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				done();
			});
		});
		it('should err deleting the non-existing file', function(done) {
			chai.request(server)
			.del(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				done();
			});
		});
	});
});