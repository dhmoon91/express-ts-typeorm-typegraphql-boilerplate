import { Request, Response } from 'express';

import { User } from '../../entities/user.entity';

import { getGoogleUser } from './getGoogleUser.service';
import { getGoogleToken } from './getGoogleToken.service';
import { createGoogleUser } from './createGoogleUser.service';
import { getGoogleJwt } from './getGoogleJwt.service';

export async function googleOAuthHandler(req: Request, res: Response) {
    try {
        let user;

        // get the code from redirect url
        const code = req.query.code as string;

        // get the user id and access token using the code
        const googleToken = await getGoogleToken({ code });

        // get user info with tokens
        const googleUser = await getGoogleUser(
            googleToken.accessToken,
            googleToken.idToken
        );

        // The user is synchronizing with Google
        if (googleToken.refreshToken) {
            // create the user
            user = await createGoogleUser(
                googleUser,
                googleToken.refreshToken,
                req
            );
        }
        // The user has already synchronized with Google and login with Termin
        else if (req.session.userId) {
            user = await User.findOne({
                where: { id: req.session.userId, isSync: true },
            });
        }
        // The user has already synchronized with Google, but the seesion has expired and signed up via Google (like trying to login via google)
        else {
            user = await User.findOne({
                where: { email: googleUser.email, isSync: true },
            });
        }

        // generate Google JWT including access token
        const jwt: string = await getGoogleJwt(googleToken.accessToken);

        // create a session
        req.session.jwt = jwt;
        req.session.userId = user!.id;
        req.session.refreshId = user?.googleTokenId;

        console.info('access_token');
        console.info(googleToken.accessToken);
        console.info('jwt');
        console.info(jwt);

        // redirect back to client
        // TODO: express url using env
        res.redirect('http://localhost:3000/');
    } catch (err: any) {
        console.info(err);
    }
}
