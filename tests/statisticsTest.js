var request = require('supertest');
var app = require('../app');

describe('app', function () {
    describe('POST /statistics', function () {
        it('should accept non empty values for experiment', function (done) {
            // the values that should be accepted as experiment property
            var values = ['a','1','experiment','null'];
            values.forEach(function (value, index) {
                request(app)
                    .post('/statistics')
                    .set('Content-Type', 'application/json')
                    .send({
                        experiment: value,
                        variant: 'variant1',
                        data: [0,1,2,3,4,5,6,7,8,9]
                    })
                    .expect(202, function () {
                        if (index >= values.length - 1) {
                            done();
                        }
                    });
            });
        });
        it('should reject a missing body', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send('')
                .expect(400, done);
        });
        it('should reject an empty body', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({})
                .expect(400, done);
        });
        it('should reject request when experiment property is missing', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    variant: 'variant1',
                    data: [0,1,2,3,4,5,6,7,8,9]
                })
                .expect(400, done);
        });
        it('should reject request when experiment property is empty', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    experiment: '',
                    variant: 'variant1',
                    data: [0,1,2,3,4,5,6,7,8,9]
                })
                .expect(400, done);
        });
        it('should reject request when variant property is missing', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    experiment: 'experiment1',
                    data: [0,1,2,3,4,5,6,7,8,9]
                })
                .expect(400, done);
        });
        it('should reject request when variant property is empty', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    experiment: 'experiment1',
                    variant: '',
                    data: [0,1,2,3,4,5,6,7,8,9]
                })
                .expect(400, done);
        });
        it('should reject request when data property is missing', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    experiment: 'experiment1',
                    variant: ''
                })
                .expect(400, done);
        });
        it('should reject request when data property is empty', function (done) {
            request(app)
                .post('/statistics')
                .set('Content-Type', 'application/json')
                .send({
                    experiment: 'experiment1',
                    variant: '',
                    data: []
                })
                .expect(400, done);
        });
    });
});