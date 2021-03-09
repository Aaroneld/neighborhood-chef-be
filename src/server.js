const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const cors = require('cors');
const graphLayer = require('./graphql');

const authRouter = require('./routes/authrouter');

// const typeDefs = require('./graphql/schemas');
// const resolvers = require('./graphql/resolvers');
// const mocks = require('./mocks');
const authenticationRequired = require('./middleware/oktaAuthentication');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use((req, res, next) => {
    req.res = res;
    next();
});

app.use('/auth', authRouter);

app.get('/wakeup', (req, res) => {
    console.log('here');
    res.status(200).json({ awake: true });
});

if (process.env.NODE_ENV == 'development') {
    app.post('/authenticate', async (req, res) => {
        // const authenticated = await authenticationRequired(
        //     req.headers.authorization
        // );

        res.header('Access-Control-Allow-Origin', '*');

        res.status(200).json({
            success: true,
        });
    });
}

app.use('/graphql', graphLayer);

app.get('/error', (req, res) => {
    const { status, stacktrace, message, location, timestamp } = req.query;
    res.status(status).json({ location, message, timestamp, stacktrace });
    // res.status(status).json({ stacktrace, message, location, timestamp });
});

// const path = '/graphql';

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   mocks,
//   mockEntireSchema: false,
//   context: async ({ req }) => {
//     const token = req.headers.authorization;

//     const authenticated = authenticationRequired(token);

//     return { authenticated };
//   },
//   validationRules: [depthLimit(3)],

//   playground: {
//     path: path,
//     settings: {
//       "editor.theme": "dark",
//     },
//   },
// });

//app.applyMiddleware({ app, path });

module.exports = app;
