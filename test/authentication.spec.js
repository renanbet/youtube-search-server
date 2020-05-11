const controller = require('../modules/authentication/controllers/user.controller');
const expect = require('chai').expect;
let time = (new Date()).getTime()
let username = `username-${time} `
let password = 'password'

var db = require('../config/db');
let mongoUrl = process.env.MONGO_URL || ''
db(mongoUrl)

describe('Authentication add user', () => {
    it('Should add user', async () => {
        let res = await controller.insert(username, password)
        expect(res).to.be.true;
    });
});

describe('Authentication login user', () => {
    it('Should have user token', async () => {
        let res = await controller.login(username, password)
        expect(res.token).to.be.a('string')
    });
});