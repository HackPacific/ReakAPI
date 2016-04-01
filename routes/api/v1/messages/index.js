module.exports = function(app, Model, Lib) {
  app.get('/messages', function(req, res) {
    Lib.Request('https://graph.facebook.com/debug_token?input_token=' + req.query.token + '&access_token=' + process.env.FB_APP_TOKEN, function (error, response, body) {
      if (JSON.parse(body).data.is_valid) {
        Model.Message.find({}, function(err, messages) {
          messages = messages.map(function(item){
            return item.content;
          });

          res.status(200).send(messages);
        });
      } else {
        res.status(401).send({ authorized: false });
      }
    })

  });
}
