import { Request } from 'express';

import { GoogleToken } from '../../entities/googleToken.entity';
import { User } from '../../entities/user.entity';
import { UserInput } from '../../types/UserInput';

export const createGoogleUser = async (
    googleUser: UserInput,
    refreshtoken: string,
    req: Request
): Promise<User> => {
    let user: any;

    // Store the values into DB
    const refreshToken = GoogleToken.create({
        calendarId: googleUser.email,
        refreshToken: refreshtoken,
    });
    await refreshToken.save();

    // Check the user login up via Termin or not
    if (req.session.userId) {
        user = await User.update(
            { id: req.session.userId },
            { isSync: true, googleTokenId: refreshToken.id }
        );

        // set the userId into refreshToken DB
        refreshToken.userId = req.session.userId;

        user = await User.findOne({ where: { id: req.session.userId } });
    } else {
        // The user signed up via Google
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
    }

    await refreshToken.save();

    return user!;
};
