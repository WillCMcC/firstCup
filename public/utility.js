var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};
var exports = module.exports;
exports.checkUser = function(req, res, next){
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, id, callback) {
	req.session.regenerate(function() {
     	req.session.user = id;
		console.log('util',req.session.user)
	    callback(req, res);
    });
};
