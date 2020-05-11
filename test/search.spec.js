const controller = require('../modules/youtube/controllers/search.controller');
const expect = require('chai').expect;
let time = (new Date()).getTime()
let search = {
    text: time
}
let userId = '5eb84d57d051e96feeb51472'
let searchId = ''

var db = require('../config/db');
let mongoUrl = process.env.MONGO_URL || ''
db(mongoUrl)

describe('Youtube Search', () => {
    it('Should add search', async () => {
        let res = await controller.insert(search, userId)
        searchId = res._id
        expect(res._id && res._id !== '').to.be.true;
    });
    it('Should get search', async () => {
        let res = await controller.get(searchId)
        expect(res.text.toString() === search.text.toString()).to.be.true;
    });
});
