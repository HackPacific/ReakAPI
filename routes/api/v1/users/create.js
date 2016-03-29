module.exports = function(app, Model, Lib) {
  var randomstring = require("randomstring");

  app.post('/users', function(req, res) {

    var auth_check_url = 'https://graph.facebook.com/debug_token?input_token=' + req.body.fb_access_token + '&access_token=' + process.env.FB_APP_TOKEN;

    var user_info_url = 'https://graph.facebook.com/me?fields=email,first_name,last_name&access_token=' + req.body.fb_access_token;

    Lib.Request(auth_check_url)
    .then(function(resp) {
      var fbUserToken = JSON.parse(resp).data;
      return fbUserToken;
    })
    // Check user's FB Oauth Token validations
    .then(function(fbUserToken) {
      if (fbUserToken.is_valid) {
        return [fbUserToken, Model.User.find({ fb_user_id: fbUserToken.user_id })];
      } else {
        throw new Error('FB User Token Invalid');
      }
    })
    // Check if the user already exists in db
    .spread(function(fbUserToken, existingUser) {
      if (existingUser.length != 0) {
        throw new Error('User already exists');
      }

      return [fbUserToken, Lib.Request(user_info_url)];
    })
    .spread(function(fbUserToken, resp) {
      var fbUser = JSON.parse(resp);

      var user = new Model.User({
        fb_user_id: fbUser.id,
        first_name: fbUser.first_name,
        last_name: fbUser.last_name,
        email: fbUser.email,
        fb_expires_at: fbUserToken.expires_at
      });

      return user.save();
    })
    // Log in newly created user
    .then(function(user) {
      var session = new Model.Session({
        token: randomstring.generate(),
        user_id: user._id
      });

      return [user, session.save()];
    })
    .spread(function(user, session) {
      res.send({ data: {user: user, session: session }, success: true });
    })
    .catch(function(err) {
      res.send({ message: err.message, success: false });
    });

  });
}
