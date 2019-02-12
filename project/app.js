var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//中间件
var usersRouter = require('./routes/users');
var goodsRouter = require("./routes/goods")

//引入cookie-session中间件
var cookieSession = require('cookie-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置session
app.use(cookieSession({
  name:'sun',
  secret:'hello',
  maxAge:1000*60//cookie的存储时间，超过改时间，cookie会自动销毁
}))

//---------------------------------------------接口设计--------------------------------------------
//当路径为/api时，执行uersRouter中间件
app.use('/api', usersRouter);
//当路径为/goods时，执行goodsRouter中间件
app.use("/goods",goodsRouter)



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

module.exports = app;
