const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils.js')

module.exports.createSession = (req, res, next) => {
    var datastore = {};
    // req.body.sessionID
    // response, send back object with session data
     console.log("We are getting in the HEREEEEEEEEEEEEEE");
    if (req.cookies && req.cookies.hasOwnProperty('shortlyid')){
        // get session data from table using cookie hash
       console.log("we are getting inside the if statemten");
        models.Sessions.get({hash: req.cookies.shortlyid})
        .then(session => {
            // Set the request session to the session found
            req.session = session;
            next();
        }).catch(err => {
            // clear and reassign new cookie
            res.clearCookie("shortlyid");
            //cookie is the hash of the shortly id?
            // might need to return session here 
            models.Sessions.create()
            .then(session => {
                return models.Sessions.get({id: session.insertId})
            }).then(data => {
                req.session = {};
                req.session = {hash: data.hash};
                // we might need to return session here
                // res.cookie("shortlyid", data.hash);
                // return session;
                next();
            })
        });
    } else {
        console.log("THIS ROUTE IS STIL BEING PINGEd");
        models.Sessions.create()
        .then(session => {
            return models.Sessions.get({id: session.insertId})
        }).then(data => {
            req.session = {};
            req.session = {hash: data.hash};
            res.cookie("shortlyid", data.hash);
            next();
        })
        // .catch(err => {
        //     console.log("ERROR");
        // });

    }

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

