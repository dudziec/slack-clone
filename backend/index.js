import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { sequelize, models } from './sequelize';
import {mergeResolvers, loadFilesSync, mergeTypeDefs } from 'graphql-tools'
import path from 'path';
import jwt from 'jsonwebtoken'
import { refreshTokens } from './auth';
import { log } from 'console';

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')));
const SECRET = 'dsadamsofasbnfasnfpasuin1231218hfdsa123';
const SECRET2 = 'asiodfhoi1hoi23jnl1kejasdjlkfasdd';

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if(token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
        } catch(err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            if(newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => (
        { 
        models, 
        SECRET,
        SECRET2,
        user: req.user,
    })
});

const APP = express();

APP.use(addUser);

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
