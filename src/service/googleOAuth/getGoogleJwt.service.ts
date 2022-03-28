import jwt from 'jsonwebtoken';

export const getGoogleJwt = async (accessToken: string) => {
    const googleJwt = jwt.sign(
        { access_token: accessToken },
        process.env.JWT_SECRET as string,
        {
            expiresIn: '30m',
            issuer: 'termin',
        }
    );

    return googleJwt;
};
