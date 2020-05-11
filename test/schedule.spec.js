const controller = require('../modules/youtube/controllers/schedule.controller');
const expect = require('chai').expect;
let time = (new Date()).getTime()
let schedule = {
    user: time,
    sunday: 10,
    monday: 10,
    tuesday: 10,
    wednesday: 10,
    thursday: 10,
    friday: 10,
    saturday: 10
}

var db = require('../config/db');
let mongoUrl = process.env.MONGO_URL || ''
db(mongoUrl)

describe('Youtube schedule', () => {
    it('Should add schedule', async () => {
        let res = await controller.insert(schedule)
        expect(res._id && res._id !== '').to.be.true;
    });
    it('Should get schedule', async () => {
        let res = await controller.getByUser(schedule.user)
        expect(res.sunday === schedule.sunday).to.be.true;
        expect(res.monday === schedule.monday).to.be.true;
        expect(res.tuesday === schedule.tuesday).to.be.true;
        expect(res.wednesday === schedule.wednesday).to.be.true;
        expect(res.thursday === schedule.thursday).to.be.true;
        expect(res.friday === schedule.friday).to.be.true;
        expect(res.saturday === schedule.saturday).to.be.true;
    });
});
