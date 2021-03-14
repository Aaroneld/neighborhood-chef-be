const Query = require('./queries');
const Mutation = require('./mutations');

//middleware can be attached here

module.exports = { ...Query, Mutation };
