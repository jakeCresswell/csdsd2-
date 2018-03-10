'use strict'
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Test cases with Chai and Mocha
var expect = require('chai').expect;
var request = require('supertest');
var should = require('chai').should();
var supertest = require('supertest');
var express = require('express');
let mongoose = require('mongoose');
let User = require('../models/users');
let Project = require('../models/project');
var sinon = require('sinon');
var app = express();
let api = supertest('http://localhost:3000');
let chai = require('chai');
let chaiHttp = require('chai-http');
var projectRoutes = require('../controllers/projects');
const registerController = require('../controllers/register');
var request = require('request');
var requiresLogin = require('../middleware/index');

chai.use(chaiHttp);

const userCredentials = {
    email: 'sponge@bob.com',
    password: 'garyTheSnail'
}

// ---initial santiy check that our test structure is working---- //
describe('Check Mocha', function () {
    //Test spec / unit test
    it('should run our tests using npm', function () {
        expect(true).to.be.ok;
    });
});
//1. checks initial app is running once localhost is started, responds with 200
it('should return a response with HTTP code 200', function (done) {
    api.get('').expect(200, done);
});

//2. Checks that other controller routes render as expected
describe('pages render correctly', function () {
    it('should return a response ok when getting other pages, from other controllers like register ', function (done) {
        api.get('/register/register').expect(200, done);
    });
});

//-------- MODEL UNIT TESTING ---------//
//4.check that required attributes of the user model exist
describe('User', function () {
    it('should be invalid if name and other required properties are empty', function (done) {
        var u = new User();

        u.validate(function (err) {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.jobTitle).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.userName).to.exist;
            expect(err.errors.password).to.exist;
            done();
        });
    });
});









