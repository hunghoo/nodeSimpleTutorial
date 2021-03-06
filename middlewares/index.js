var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoStore = require('connect-mongo');
const session = require('express-session');

var setting = require('../setting');
const {getRootPath} = require('../tools/index');
const rootPath = getRootPath();

const setMiddleware = function(app) {
    app.set('views', path.join(rootPath, 'views'));
    app.set('view engine', 'ejs');
}


const addMiddleWare = function(app) {

    app.use(logger('dev'));
    app.use(express.json());
    app.use(cookieParser(setting.cookieSecret));// 与bodyParser配合
    app.use(express.static(path.join(rootPath, 'public')));
    
    app.use(session({
        secret: setting.cookieSecret,
        resave: true,
        cookie: { secure: true },
        saveUninitialized:true
    }));
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });
    
    
    
    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
     
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
}

module.exports = function(app) {
    setMiddleware(app);
    addMiddleWare(app);
}