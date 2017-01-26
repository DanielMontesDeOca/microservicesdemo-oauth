const grpc = require('grpc');
const server = new grpc.Server();
const port = process.env.PORT || 50051;

// Protos

const authProto = grpc.load('/var/lib/core/protos/auth.proto').auth;

// Controllers

const Token = require('./api/controllers/token.js');

server.addProtoService(authProto.Auth.service, Token);
server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();

console.log(`Listening on port ${port}`);

module.exports.app = server;
