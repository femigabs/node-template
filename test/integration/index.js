import { expect } from 'chai';
import request from 'supertest';
import app from '../../index';

describe('Integration test', () => {
    it('Hello World', (done) => {
        request(app)
            .get('/api/v1/')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body.message).to.equal('Hello World');
                done();
            });
    });
});