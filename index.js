const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');

const app = express();
// require dotenv to setup env variables

require('dotenv').config();
//setup helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),

        'script-src': ['self', 'localhost:5000', 'https://lit-retreat-32140.herokuapp.com/'],

        'connect-src': ['https://lit-retreat-32140.herokuapp.com/', 'localhost:5000'],
      },
    },
  })
);
app.use(compression());

const PORT = process.env.PORT || 5000;
// view engine
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes());

app.use((req, res, next) => next(createError(404, 'Page Not Found')));

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status);
  res.json({
    error: true,
    msg: res.msg || 'Resouce you are looking is not found or something went wrong from our side',
  });
});

mongoose
  .connect(process.env.PROD_MONG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Wr are running on poRt : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    return;
  });
