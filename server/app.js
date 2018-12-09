const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth.js');
const parseCookies = require('./middleware/cookieParser.js');
const models = require('./models');
//we are adding user class
const user = require('./models/user.js');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(parseCookies);
app.use(Auth.createSession);




app.get('/',
(req, res) => {
  res.render('index');
});

app.get('/create', 
(req, res) => {
  res.render('index');
});

app.get('/links', 
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', 
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

// check if user name exists
  // if exists, redirect to signup
  // otherwise create a user
  return user.create({username, password})
   .then(data=>{
      // console.log("BOJACK HORSEMAN", data);
      // res.send(data);
      // console.log("RES HEADERS", res.headers);
      res.redirect('/');
    }).catch(err => {
      res.redirect('/signup');
    })
    // .then(results => {
    //   models.Sessions.update({hash: req.session.hash}, {userId: results.insertId})
    // });
})

app.post('/login', (req, res) => {
  //get user username and password, password is already salted
  //salt their req password and compare with the username salted password
  //then on success, redirect to 201, root /
  // on failure, do 404
  var username = req.body.username;
  var password = req.body.password;

  return user.get({username: username})
  .then(data => {
    if (user.compare(password, data.password, data.salt)) {
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  }).catch(() => {
    res.redirect('/login');
  })

})



/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
