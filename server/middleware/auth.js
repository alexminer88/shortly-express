const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
    var datastore = {};
    // req.body.sessionID
    // response, send back object with session data
    console.log("req.body: ", req.body);
    // models.Sessions.create();

    
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

