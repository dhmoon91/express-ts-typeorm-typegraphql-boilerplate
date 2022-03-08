import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import {
    UserInput,
    UserUpdateInput,
    UserUpdatePasswordInput,
} from '../inputType/UserInput';
import { User } from '../entities/User';

/**
 * All gql resolvers regarding User.
 */
@Resolver()
export class UserResolver {
    @Query(() => [User])
    getUsers() {
        return User.find();
    }

    @Query(() => User)
    getUser(@Arg('id') id: number) {
        const user = User.findOne({ where: { id } });
        return user;
    }

    @Mutation(() => User)
    async createUser(@Arg('data') data: UserInput) {
        const user = User.create(data);

        await user.save();
        return user;
    }

    @Mutation(() => User)
    async updateUser(@Arg('data') data: UserUpdateInput) {
        const user = await User.findOne({ where: { id: data.id } });
        if (!user) throw new Error('User Not found');
        Object.assign(user, data);
        await user.save();
        return user;
    }

    @Mutation(() => User)
    async updatePassword(@Arg('data') data: UserUpdatePasswordInput) {
        const { username, oldPassword, newPassword } = data;
        const user = await User.findOne({ username: data.username });
        if (!user) {
            throw new Error('username doesnt exist');
        }

        const userPassword = user?.password;

        if (oldPassword === userPassword) {
            await User.update({ username }, { password: newPassword });

            return user;
        }
        throw new Error('Passwords do not match');
    }
}
