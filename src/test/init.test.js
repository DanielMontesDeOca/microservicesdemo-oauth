function waitForAppStart(server, done) {
  if (server.app.started) {
    return done();
  }

  setTimeout(() => {
    waitForAppStart(server, done);
  }, 1000);
}

before(function(done) {
  waitForAppStart(require('../app'), done);
});

after(function(done) {
  const server = require('../app');

  server.app.forceShutdown();
  done();
});
