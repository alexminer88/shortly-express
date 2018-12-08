const utils = require('../lib/hashUtils.js'); 

const parseCookies = (req, res, next) => {
    var cookies = {};
    // var cookies = req.headers;
    // if cookie does not exist
    if (req.headers.cookie === undefined) {
        // create new session id and send back in response



    } else {
        req.headers.cookie.split('; ').forEach((element)=>{
            var arr = element.split('=');
            cookies[arr[0]] = arr[1];
            
        });
        req.cookies = cookies;
    }
    next();
    
};

module.exports = parseCookies;