// index.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const sequelize = require('./config/database');

const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

sequelize.sync()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on http://localhost:4000/graphql");
    });
  })
  .catch((error) => console.log("Error initializing database", error));
