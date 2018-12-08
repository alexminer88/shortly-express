const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils.js')

module.exports.createSession = (req, res, next) => {
    var datastore = {};
    // req.body.sessionID
    // response, send back object with session data
    if (req.headers.cookies === undefined) {
        let data = utils.createRandom32String();
        let hash = utils.createHash(data);

        req.session = {};
        req.session.hash = hash;
        res.cookies = {shortlyid: {value: 'asdasdas'}};
    }
    

    console.log("response ASDASKDJLASD: ", res);
    // models.Sessions.create();

    next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

