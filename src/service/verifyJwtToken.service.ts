import jwt from 'jsonwebtoken';

// This service will help verifying the JWT Token of Google or Apple
/**
 * TODO: more subdivision of validation
 *
 * 1. access token and refresh token are all expired => return error
 * 2. access toekan is expired, but refresh token is valid => re-generate the access token
 * 3. access token is valid, but refresh token is expired => re-generate the refresh token
 * 4. access toekn and refresh token are all valid => verified
 * */

export const verifyJwtToken = async (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
        return null;
    }
};
