import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import 'reflect-metadata';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';

import { googleOAuthHandler } from './service/googleOAuth/googleHandler.service';

dotenv.config();

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'termin_dev',
        username: 'termin_admin',
        password: 'termin',
        logging: false,
        synchronize: true,
        entities: [`${__dirname}/entities/**/*.entity.{ts,js}`],
    });

    const app = express();

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000',
        })
    );

    // accept data as json.
    app.use(express.json());

    const RedisStore = connectRedis(session);

    const redisClient = redis.createClient({
        host: 'localhost',
        port: 6379,
    });

    redisClient.on('error', (err) => {
        console.info(`Could not establish a connection with redis. ${err}`);
    });

    redisClient.on('connect', () => {
        console.info('Connected to redis successfully');
    });

    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            name: 'termin',
            secret: 'TERMIN_APP',
            resave: false,
            saveUninitialized: false,
            cookie: {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 90,
            },
        })
    );

    const schema = await buildSchema({
        // Load all resolvers
        resolvers: [`${__dirname}/resolvers/**/*.{ts,js}`],
        authChecker: ({ context: { req } }) => {
            if (req.session.userId) {
                return true;
            }

            return false;
        },
    });

    // Google OAuth redirect
    app.get('/test', googleOAuthHandler);

    /* eslint-disable arrow-body-style */
    app.use(
        '/graphql',
        graphqlHTTP((req) => {
            return {
                schema,
                graphiql: true,
                context: { req },
            };
        })
    );

    app.listen(5000, () => {
        console.info('server running on port 5000');
    });
};

main().catch((err) => {
    console.error(err);
});
