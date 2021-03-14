const typeDefs = require('./types.js');
const resolvers = require('./resolvers/index');
const { makeExecutableSchema } = require('@graphql-tools/schema');

module.exports = makeExecutableSchema({ typeDefs, resolvers });
