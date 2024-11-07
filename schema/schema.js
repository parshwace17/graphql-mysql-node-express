// schema/schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, GraphQLID } = require('graphql');
const User = require('../models/User');
const Product = require('../models/Product');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return parent.getProducts();
      },
    },
  }),
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return parent.getUsers();
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.findAll();
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve() {
        return Product.findAll();
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.create({
          name: args.name,
          email: args.email,
        });
      },
    },
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
      },
      resolve(parent, args) {
        return Product.create({
          name: args.name,
          price: args.price,
        });
      },
    },
    addUserProduct: {
      type: UserType,
      args: {
        userId: { type: GraphQLID },
        productId: { type: GraphQLID },
      },
      resolve(parent, args) {
        return User.findByPk(args.userId).then(user => {
          return Product.findByPk(args.productId).then(product => {
            return user.addProduct(product);
          });
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
