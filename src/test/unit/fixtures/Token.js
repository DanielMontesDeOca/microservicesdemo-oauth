module.exports = {
  getToken: {
    req: {
      request: {
        grant_type: 'client_credentials'
      }
    },
    reqWithoutCredential: {
      request: {
        grant_type: ''
      }
    },
    token: {
      value: '7e23c7d434db72ad5a276d23070498d5e04874bd6c6d2bd1f0090190889157b0',
      expiration: 60000
    }
  },

  validateToken: {
    req: {
      request: {
        value: '7e23c7d434db72ad5a276d23070498d5e04874bd6c6d2bd1f0090190889157b0'
      }
    }
  }
}
