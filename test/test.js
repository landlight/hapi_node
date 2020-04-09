process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();

chai.use(chaiHttp);

// Server Status
describe('Checking Server Status', () => {
    it('it should return success', (done) => {
    chai.request('localhost:3000')
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
            res.text.should.be.eql("Testing hapi with mocha and chai");
            done();
        });
    });
});

// Assignment 1
describe('Assignment 1 with empty json', () => {
    it('it should return success', (done) => {
    chai.request('localhost:3000')
        .post('/assignment1')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql([]);
            done();
        });
    });
});

const successJson = [
    {
        "id": 10,
        "title": "House",
        "level": 0,
        "children": [
            {
                "id": 12,
                "title": "Red Roof",
                "level": 1,
                "children": [
                    {
                        "id": 17,
                        "title": "Blue Window",
                        "level": 2,
                        "children": [],
                        "parent_id": 12
                    },
                    {
                        "id": 15,
                        "title": "Red Window",
                        "level": 2,
                        "children": [],
                        "parent_id": 12
                    }
                ],
                "parent_id": 10
            },
            {
                "id": 18,
                "title": "Blue Roof",
                "level": 1,
                "children": [],
                "parent_id": 10
            },
            {
                "id": 13,
                "title": "Wall",
                "level": 1,
                "children": [
                    {
                        "id": 16,
                        "title": "Door",
                        "level": 2,
                        "children": [],
                        "parent_id": 13
                    }
                ],
                "parent_id": 10
            }
        ],
        "parent_id": null
    }
]

describe('Assignment 1 with test data', () => {
    it('it should return success', (done) => {
    chai.request('localhost:3000')
        .post('/assignment1')
        .send(
            {"0":
            [{"id": 10,
                "title": "House",
                "level": 0,
                "children": [],
                "parent_id": null}],
            "1":
            [{"id": 12,
                "title": "Red Roof",
                "level": 1,
                "children": [],
                "parent_id": 10},
            {"id": 18,
                "title": "Blue Roof",
                "level": 1,
                "children": [],
                "parent_id": 10},
            {"id": 13,
                "title": "Wall",
                "level": 1,
                "children": [],
                "parent_id": 10}],
            "2":
            [{"id": 17,
                "title": "Blue Window",
                "level": 2,
                "children": [],
                "parent_id": 12},
            {"id": 16,
                "title": "Door",
                "level": 2,
                "children": [],
                "parent_id": 13},
            {"id": 15,
                "title": "Red Window",
                "level": 2,
                "children": [],
                "parent_id": 12}]}
        )
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql(successJson);
            done();
        });
    });
});

// Assignment 2
describe('Assignment 2 test pageNo since cannot test data with network instead see the data on local server /assignment2', () => {
    it('it should return success', (done) => {
    chai.request('localhost:3000')
        .get('/assignment2')
        .query({page: 2})
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});