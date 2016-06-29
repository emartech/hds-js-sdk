// 'use strict';
//
// const HdsSendsStreamFactory = require('./');
// const HdsRequestFactory = require('../hds-request-factory');
// const request = require('request');
// const stream = require('stream');
// const Delay = require('../delay');
//
// describe('HdsSendsStreamFactory', function() {
//
//   describe('::create', function() {
//
//     beforeEach(function() {
//       createRequestStub = createRequestStub.bind(this);
//     });
//
//     it('should call hds request factory with customerid', function() {
//       this.sandbox.stub(HdsRequestFactory, 'create').returns(createRequestStub());
//
//       // HdsSendsStreamFactory.create('[customer id]').createStream();
//
//       expect(HdsRequestFactory.create).to.have.been.calledWithExactly('[customer id]');
//     });
//
//     it('should post email sends query to hds request', function() {
//       const requestStub = createRequestStub();
//       this.sandbox.stub(HdsRequestFactory, 'create').returns(requestStub);
//
//       HdsSendsStreamFactory.create('customer id').createStream();
//
//       expect(requestStub.post).to.have.been.calledWithExactly('/segments', {
//         query: 'SELECT contact_id, campaign_id, campaign_type, event_time FROM emarsys_email_send'
//       });
//     });
//
//     let createRequestStub = function() {
//       const requestStub = {
//         post: this.sandbox.spy()
//       };
//       return requestStub;
//     };
//
//   });
//
//
//   describe('::createFileStream', function() {
//     const registerResult = { poll_url: '/customer/15/poll_it' };
//     const segmentResult = { url: 'http://path-to-download' };
//     const readableStream = new stream.Readable();
//     let subject;
//
//     beforeEach(function() {
//       this.sandbox.stub(HdsRequestFactory.prototype, 'registerSegment')
//         .returns(Promise.resolve(registerResult));
//       this.sandbox.stub(HdsRequestFactory.prototype, 'pollSegmentResult');
//       this.sandbox.stub(HdsRequestFactory.prototype, 'getResult').returns(readableStream);
//       this.sandbox.stub(request, 'get').returns(readableStream);
//       this.sandbox.stub(Delay, 'wait').returns(Promise.resolve());
//       subject = HdsSendsStreamFactory.create(15);
//     });
//
//     it('should register segment and return its result', function*() {
//       HdsRequestFactory.prototype.pollSegmentResult
//         .returns(Promise.resolve({ url: 'http://path-to-download' }));
//
//       const requestFileStream = yield subject.createFileStream('send');
//
//       expect(HdsRequestFactory.prototype.registerSegment).to.have.been.calledWith('send');
//       expect(HdsRequestFactory.prototype.pollSegmentResult).to.have.been.calledWith(registerResult.poll_url);
//       expect(HdsRequestFactory.prototype.getResult).to.have.been.calledWith(segmentResult.url);
//       expect(requestFileStream).to.eql(readableStream);
//     });
//
//     it('should poll until result is returned', function*() {
//       HdsRequestFactory.prototype.pollSegmentResult
//         .onCall(0).throws(new Error('Empty response'));
//       HdsRequestFactory.prototype.pollSegmentResult
//         .onCall(1)
//         .returns(Promise.resolve({ url: 'http://path-to-download' }));
//
//       yield subject.createFileStream('send');
//
//       expect(HdsRequestFactory.prototype.pollSegmentResult).to.have.been.calledTwice;
//       expect(Delay.wait).to.have.been.calledWith(1000);
//     });
//
//     it('should throw error when no result after polling', function*() {
//       HdsRequestFactory.prototype.pollSegmentResult
//         .throws(new Error('Empty response'));
//
//       try {
//         yield subject.createFileStream('send');
//         throw new Error('Error should be thrown');
//       } catch (e) {
//         expect(e.message).to.eql('No response received during polling');
//       }
//     });
//   });
//
// });
