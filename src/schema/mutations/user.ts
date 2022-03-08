import { GraphQLID, GraphQLString } from 'graphql';

import { UserType } from '../typedefs/User';
import { MessageType } from '../typedefs/Message';
import { User } from '../../entities/user';

export const CREATE_USER = {
    type: UserType,
    args: {
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent: any, args: any) {
        // const { name, username, password } = args;
        // await User.insert({name, username, password})
        await User.insert(args);
        return args;
    },
};

export const UPDATE_PASSWORD = {
    type: MessageType,
    args: {
        username: { type: GraphQLString },
        oldPassword: { type: GraphQLString },
        newPassword: { type: GraphQLString },
    },
    async resolve(parent: any, args: any) {
        const { username, oldPassword, newPassword } = args;

        const user = await User.findOne({ username });

        if (!user) {
            throw new Error('username doesnt exist');
        }
        const userPassword = user?.password;

        if (oldPassword === userPassword) {
            await User.update({ username }, { password: newPassword });

            return { successful: true, message: 'Password updated' };
        }
        throw new Error('Passwords do not match');
    },
};

export const DELETE_USER = {
    type: MessageType,
    args: {
        id: { type: GraphQLID },
    },
    async resolve(parent: any, args: any) {
        const { id } = args;

        // await User.insert({name, username, password})
        await User.delete(id);
        return { successful: true, message: 'Delete worked' };
    },
};
