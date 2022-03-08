import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import { createConnection } from 'typeorm';

import { schema } from './schema';
import { User } from './entities/user';

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'termin_dev',
        username: 'termin_admin',
        password: 'termin',
        logging: true,
        synchronize: false,
        entities: [User],
    });

    const app = express();

    app.use(cors());

    // accept data as json.
    app.use(express.json());

    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            graphiql: true,
        })
    );

    app.listen(5000, () => {
        console.info('server running on port 5000');
    });
};

main().catch((err) => {
    console.error(err);
});
