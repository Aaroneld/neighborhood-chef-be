const schema = require('./schema');

const { graphqlHTTP } = require('express-graphql');

module.exports = graphqlHTTP({
  schema: schema,
  graphiql: true,
});
