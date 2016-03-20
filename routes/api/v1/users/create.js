module.exports = function(app, Model, Lib) {
  app.post('/users', function(req, res) {

    var auth_check_url = 'https://graph.facebook.com/debug_token?input_token=' + req.body.fb_access_token + '&access_token=' + process.env.FB_APP_TOKEN;

    var user_info_url = 'https://graph.facebook.com/me?fields=email,first_name,last_name&access_token=' + req.body.fb_access_token;

    // Check user's FB Oauth Token validations
    Lib.Request(auth_check_url, function (error, response, body) {
      var fbUserToken = JSON.parse(body).data;

      if (fbUserToken.is_valid) {
        // Check if the user already existsin db
        Model.User.find({ fb_user_id: fbUserToken.user_id }, function(err, existingUser) {

          if (existingUser.length) {
            // if the user already exists in DB, auto log user in instead
            res.send({ status: 'user already exists' });
          } else {
            // if the user doesn't exists in DB, create record
            Lib.Request(user_info_url, function (error, response, body) {
              var fbUser = JSON.parse(body);

              var user = new Model.User({
                fb_user_id: fbUser.id,
                first_name: fbUser.first_name,
                last_name: fbUser.last_name,
                email: fbUser.email,
                fb_expires_at: fbUserToken.expires_at
              });

              user.save(function(err, user) {
                res.send({ data: user, success: true, status: 201 });
              });
            });
          }
        });

      } else {
        res.send({ success: false, status: 401 });
      }
    });

  });
}
