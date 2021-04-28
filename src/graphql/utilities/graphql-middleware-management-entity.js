const Query = require('../resolvers/queries');

function GraphQLMiddlewareManagementEntity(configObject) {
  const queries = configObject.queries;
  const mutations = configObject.mutations;
  const mutationMiddleware = configObject.mutationMiddleWare;
  const queryMiddleware = configObject.queryMiddleware;
  const ErrorHandler = configObject.ErrorHandler || null;
  const modifiedResolvers = {};

  const crawlQueries = () => {
    for (key in queries) {
      for (key2 in queries[key]) {
        modifiedResolvers[key] = {};
        if (queryMiddleware[key][key2]) {
          modifiedResolvers[key][key2] = composeMiddleware(key, key2);
        } else {
          modifiedResolvers[key1][key2] = queries[key1][key2];
        }

        if (ErrorHandler) {
          modifiedResolvers[key][key2] = addErrorHandler(modifiedResolvers[key][key2]);
        }
      }
    }
  };

  const crawlMutations = () => {
    for (key in mutations) {
      if (mutationMiddleware[key]) {
        modifiedResolvers['Mutation'][key] = composeMiddleware(key);
      } else {
        modifiedResolvers['Mutation'][key] = mutations[key];
      }

      if (ErrorHandler) {
        modifiedResolvers['Mutation'][key] = addErrorHandler(modifiedResolvers['Mutation'][key]);
      }
    }
  };

  const composeMiddleware = (k1, k2 = null) => {
    const middleware;
    const resolver;

    if (k1 && k2) {
      middleware = queryMiddleware[k1][k2];
      resolver = queries[k1][k2];
    } else {
      middleware = mutationMiddleWare[k1];
      resolver = mutations[k1];
    }

    return (obj, args, ctx, info) => {
      let graphQLParameters = [obj, args, ctx, info];

      for (let i = 0; i < middleware.length; i++) {
        graphQLParameters[0] = middleware[i](...graphQLParameters);
      }

      return resolver(...graphQLParameters);
    };
  };

  const addErrorHandler = (resolver) => {
    return (...rest) => {
      try {
        resolver(...rest);
      } catch (err) {
        ErrorHandler(err);
      }
    };
  };

  const main = () => {
    crawlQueries();
    crawlMutations();
  };

  main();

  return modifiedResolvers;
}

const modifiedResolvers = new GraphQLMiddlewareManagementEntity({
  queries: {
    Query: {
      status: () => {
        return 'OK!';
      },
    },
  },
  queryMiddleware: {
    Query: {
      status: [
        (obj, args, ctx, info) => {
          obj.id = {};
          args.queryParams = { id: 1 };
          return obj;
        },
        (obj, args, ctx, info) => {
          ctx.mileRadius = 25;
          return { firstname: 'Aaron' };
        },
      ],
    },
  },
});

// console.log(modifiedResolvers.Query.status({ v: 10 }, { n: 20 }, { l: 30 }, { f: 40 }));

module.exports = GraphQLMiddlewareManagementEntity;
