module.exports = function(app, Schema, Lib) {
  app.post('/messages', function(req, res) {
    var message = new Schema.Message({content: req.body.content});
    message.save(function(err, message) {

      Schema.Message.find({}, function(err, messages) {
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
