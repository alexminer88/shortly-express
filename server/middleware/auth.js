const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils.js')

module.exports.createSession = (req, res, next) => {
    var datastore = {};
    // req.body.sessionID
    // response, send back object with session data
    if (req.cookies.hasOwnProperty('shortlyid')){
        // get session data from table using cookie hash
        models.Sessions.get({hash: req.cookies.shortlyid})
        .then(session => {
            // Set the request session to the session found
            req.session = session;
            next();
        })
        // .catch(err => {
        //     console.log("ERROR");
        // });
    } else {
        
        // req.session = models.Sessions.create();
        // console.log(req.session);
        // let data = utils.createRandom32String();
        // let hash = utils.createHash(data);
        // req.session = {};
        // req.session.hash = null;
        models.Sessions.create()
        .then(session => {
            return models.Sessions.get({id: session.insertId})
        }).then(data => {
            req.session = {};
            req.session = {hash: data.hash};
            res.cookie("shortlyid", data.hash);
            
            // res.cookies = {shortlyid: {value: req.session.hash}};
            next();
        })
        // .catch(err => {
        //     console.log("ERROR");
        // });

    }

    // if (req.headers.cookies === undefined) 
    // if (req.headers.cookies) {
    //     //then the requestWithCookies.session is the session
    //     // expect(session.user.username).to.eq(username);
    //     //         expect(session.userId).to.eq(userId);

    //     console.log(req.session);

    // }
    // requestWithCookies.cookies.shortlyid = hash;

    // console.log(req.headers.cookies);

    // requestWithCookies.cookies.shortlyid = hash;
    // if (req.headers.cookies.shortlyid) {
    //     //do stuff, get the session using the req.session.shortlyid as a hash
    //     // .then, get the session from the session table
    // } 
    

    // console.log("response ASDASKDJLASD: ", res);
    // models.Sessions.create();

    // next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

