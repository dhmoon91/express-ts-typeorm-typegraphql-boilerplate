import { Request } from 'express';

import { GoogleToken } from '../../entities/googleToken.entity';
import { User } from '../../entities/user.entity';
import { UserInput } from '../../types/UserInput';

export const createGoogleUser = async (
    googleUser: UserInput,
    refreshtoken: string,
    req: Request
): Promise<User> => {
    let user;

    // Store the values into DB
    const refreshToken = GoogleToken.create({
        calendarId: googleUser.email,
        refreshToken: refreshtoken,
    });
    await refreshToken.save();

    // Check the user login up via Termin or not
    if (req.session.userId) {
        const id = req.session.userId as number;

        await User.update({ id }, { isSync: true });

        user = await User.findOne({ where: { id } });
    }

    // The user login up via Google
    user = User.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        isSync: true,
        googleTokenId: refreshToken.id,
    });

    await user.save();

    // set the userId into refreshToken DB
    refreshToken.userId = user.id;
    await refreshToken.save();

    return user;
};
