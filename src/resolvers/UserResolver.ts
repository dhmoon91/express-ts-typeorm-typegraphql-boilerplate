import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
} from 'type-graphql';

import {
    UserInput,
    UserUpdateInput,
    UserUpdatePasswordInput,
} from '../types/UserInput';
import { User } from '../entities/user.entity';
import { MyContext } from '../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { EventInput } from '../types/EventInput';
import { Event } from '../entities/event.entity';
import { verifyJwtToken } from '../service/verifyJwtToken.service';
// import { createEvent } from '../service/googleOAuth/createEvent.service';

/**
 * All gql resolvers regarding User.
 */
@Resolver()
export class UserResolver {
    @UseMiddleware(isAuth)
    @Query(() => [User])
    getUsers() {
        return User.find({
            relations: ['googleToken', 'events'],
        });
    }

    @Query(() => User)
    getUser(@Arg('id') id: number) {
        return User.findOne({
            where: { id },
            relations: ['googleToken', 'events'],
        });
    }

    @Query(() => User)
    getProfile(@Ctx() ctx: MyContext) {
        // TODO: need to set up more detail
        let user;

        if (ctx.req.session.userId) {
            user = User.findOne({ where: { id: ctx.req.session.userId } });
        }

        return user;
    }

    @Mutation(() => User)
    async loginUser(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Unable to fine User. Please try again');

            if (user.password !== password)
                throw new Error('Password does not matched. Please try again');

            ctx.req.session!.userId = user.id;

            return user;
        } catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }

    @Mutation(() => User)
    async createUser(@Arg('data') data: UserInput): Promise<User | null> {
        try {
            const user = User.create(data);

            await user.save();

            return user;
        } catch (err) {
            throw new Error(`Error: ${err}`);
        }
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
        const { email, oldPassword, newPassword } = data;
        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new Error('email doesnt exist');
        }

        const userPassword = user?.password;

        if (oldPassword === userPassword) {
            await User.update({ email }, { password: newPassword });

            return user;
        }
        throw new Error('Passwords do not match');
    }

    @Mutation(() => Event)
    async createEvent(
        @Arg('data') data: EventInput,
        @Ctx() ctx: MyContext
    ): Promise<Event | null> {
        try {
            const accessToken = await verifyJwtToken(ctx.req.session.jwt!);

            // TODO: need to more subdivision of validation
            if (accessToken !== undefined) {
                // for avoid ESlint error "Assignment to property of function parameter 'data'"
                [data].map((element) =>
                    Object.assign(element, {
                        userId: ctx.req.session.userId,
                    })
                );

                const event = Event.create(data);

                await event.save();

                /**
                 * TODO:
                 * This is for insert the event into Google Calendar,,
                if (event) {
                  const userEmail = User.findOne({
                    where: { id: ctx.req.session.userId, isSync: true },
                  });
                  await createEvent(data, userEmail, ctx.req.session.jwt);
                }

                  return event;
                * */
                return event!;
            }

            // TODO: need to make more detail
            return null;
        } catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }
}
