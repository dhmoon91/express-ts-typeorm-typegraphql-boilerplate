import axios from 'axios';

import { UserInput } from '../../types/UserInput';

interface UserInfo {
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export const getGoogleUser = async (
    accessToken: string,
    idToken: string
): Promise<UserInput> => {
    // API를 또 한번 call 하는 방법
    const resAPI = await axios.get<UserInfo>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    const result = {
        email: resAPI.data.email,
        firstName: resAPI.data.given_name,
        lastName: resAPI.data.family_name,
        picture: resAPI.data.picture,
    };

    return result;

    // id_token을 jwt decode 하는 방법
    /**
  const resJWT = jwt.decode(id_token) as UserInfo;

  const result = {
    email: resJWT.email,
    firstName: resJWT.given_name,
    lastName: resJWT.family_name,
    picture: resJWT.picture,
  };

  return result;
   */
};
