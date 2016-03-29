module.exports = function(app, Model, Lib) {
  var randomstring = require("randomstring");

  app.post('/sessions', function(req, res) {

    var auth_check_url = 'https://graph.facebook.com/debug_token?input_token=' + req.body.fb_access_token + '&access_token=' + process.env.FB_APP_TOKEN;

    Lib.Request(auth_check_url)
    .then(function(resp) {
      var fbUserToken = JSON.parse(resp).data;
      return fbUserToken;
    })
    // Check user's FB Oauth Token validations
    .then(function(fbUserToken) {
      if (fbUserToken.is_valid) {
        return Model.User.find({ fb_user_id: fbUserToken.user_id });
      } else {
        throw new Error('Not authenticated');
      }
    })
    // Check if the user already exists in db
    .then(function(existingUser) {
      if (existingUser.length != 0) {
        // Log in user
        var session = new Model.Session({
          token: randomstring.generate(),
          user_id: existingUser[0]._id
        });

        return session.save();
      } else {
        throw new Error('Not authenticated')
      }
    })
    .then(function(session) {
      res.send({ data: { session: session }, success: true });
    })
    .catch(function(err) {
      res.send({ message: err.message, success: false });
    });

  });
}
