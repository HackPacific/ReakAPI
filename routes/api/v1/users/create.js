module.exports = function(app, Model, Lib) {
  app.post('/users', function(req, res) {

    var auth_check_url = 'https://graph.facebook.com/debug_token?input_token=' + req.body.fb_access_token + '&access_token=' + process.env.FB_APP_TOKEN;

    var user_info_url = 'https://graph.facebook.com/me?fields=email,first_name,last_name&access_token=' + req.body.fb_access_token;

    // Check user's FB Oauth Token validations
    Lib.Request(auth_check_url)
    .then(function(resp) {
      var fbUserToken = JSON.parse(resp).data;
      return fbUserToken;
    })
    // Check if the user already exists in db
    .then(function(fbUserToken) {
      if (fbUserToken.is_valid) {
        return Model.User.find({ fb_user_id: fbUserToken.user_id });
      }
    })
    .then(function(existingUser) {
      return Lib.Request(user_info_url)
    })
    .then(function(resp) {
      var fbUser = JSON.parse(resp);

      var user = new Model.User({
        fb_user_id: fbUser.id,
        first_name: fbUser.first_name,
        last_name: fbUser.last_name,
        email: fbUser.email,
        fb_expires_at: fbUserToken.expires_at
      });

      return user.save()
    })
    .then(function(user) {
      res.send({ data: user, success: true, status: 201 });
    })
    .done();

  });
}
