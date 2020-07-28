import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { sequelize, models } from './sequelize';
import {mergeResolvers, loadFilesSync, mergeTypeDefs } from 'graphql-tools'
import path from 'path';

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));
const SECRET = 'dsadamsofasbnfasnfpasuin1231218hfdsa123';
const SECRET2 = '3213124fpdaf,mp142x=ac.qawskr12-41124';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { 
        models, 
        SECRET,
        user: { id: 1 }}
});

const APP = express();

server.applyMiddleware({
    app: APP
});

const PORT = 8080;

sequelize.sync().then(() => {
    APP.listen(PORT, () => {
        console.log(`The server has started on port ${PORT}`);
        console.log(`http://localhost:${PORT}/graphql`);
    });
});
