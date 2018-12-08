const utils = require('../lib/hashUtils.js'); 

const parseCookies = (req, res, next) => {
    // cookie = {id: }
    var cookies = {};
    // var cookies = req.headers;
    console.log("HELLO THAR", req.headers);
    // if cookie does not exist
    if (req.headers.cookie === undefined) {
        console.log("THIS IS WORKING ASDASD");
        // create new session id and send back in response

        let data = utils.createRandom32String();
        let hash = utils.createHash(data);
        req.cookies = {}; 
        console.log("REQ COOKIE", req.cookies);
    } else {
        req.headers.cookie.split('; ').forEach((element)=>{
            var arr = element.split('=');
            console.log(arr);
            cookies[arr[0]] = arr[1];
            
        });
        console.log(cookies);
        req.cookies = cookies;
    }
    // res.send(cookiessss);
    next();
        
    // if it does exist
        // compare to session id datastore and grab data
};

module.exports = parseCookies;