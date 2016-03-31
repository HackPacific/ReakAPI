module.exports = function(app, Model, Lib) {
  app.get('/friends', function(req, res) {

    var friends_url = 'https://graph.facebook.com/me/friends?access_token=' + req.query.fb_access_token;

    // Get a list of Facebook friends who are also using the App
    Lib.Request(friends_url)
    .then(function(resp) {
      res.send(JSON.parse(resp).data);
      // TODO: retrieve 321 users with their facebook user ids
      // TODO: get all fb users with the url in paging.next
    })
    .catch(function(err) {
      res.send({ message: err.message, success: false });
    });

  });
}
