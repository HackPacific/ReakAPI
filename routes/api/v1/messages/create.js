module.exports = function(app, Model, Lib) {
  app.post('/messages', function(req, res) {
    var message = new Model.Message({content: req.body.content});
    message.save(function(err, message) {

      Model.Message.find({}, function(err, messages) {
        messages = messages.map(function(item){
          return item.content;
        });

        Lib.Pusher.trigger('messages', 'new_message', {
          messages: messages
        });
   
        res.send(messages);
      });

    });
  });
}
