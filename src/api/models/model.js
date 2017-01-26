const _ = require('lodash');

class Model {
  constructor() {
    this.collection = [];
  }

  create(object) {
    object.id = '' + (this.collection.length + 1);
    object.created = new Date();
    this.collection.push(object);

    return Promise.resolve(object);
  }

  find(object) {
    const index = _.findIndex(this.collection, object);
    const value = this.collection[index];

    return Promise.resolve(value);
  }

  destroy(id) {
    const index = this.collection.indexOf(id);
    const value = this.collection[index];

    this.collection.splice(id, 0);

    return Promise.resolve(value);
  }
}

module.exports = Model;
