'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiSubset = require('chai-subset');
const chaiPromise = require('chai-as-promised');

chai.use(chaiSubset);
chai.use(sinonChai);
chai.use(chaiPromise);
global.expect = chai.expect;

beforeEach(function() {
  this.sinon = sinon;
  this.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  this.sandbox.restore();
});
