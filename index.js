const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/user');
require('./services/passport');

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
require('./Routes/authRoutes')(app);
require('./Routes/billingRoutes')(app);
if (process.env.NODE_ENV === 'production') {
  //Express will serve up production asssets
  // like our man.js or main.css file

  app.use(express.static('client/build'));
  // express will serve up index.html file
  // if it doesnot recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);
