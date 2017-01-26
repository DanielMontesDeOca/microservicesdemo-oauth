const Model = require('./model');

const Client = new Model();

Client.create({
  client_id: '1',
  client_secret: '1',
  user_id: '1'
});

module.exports = Client;
