import axios from 'axios';
import qs from 'qs';

interface GoogleTokensResult {
    accessToken: string;
    expiresTn: number;
    refreshToken: string;
    idToken: string;
}

export async function getGoogleToken({
    code,
}: {
    code: string;
}): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
        grant_type: 'authorization_code',
    };

    try {
        const res = await axios.post(url, qs.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return {
            accessToken: res.data.access_token,
            expiresTn: res.data.expires_in,
            refreshToken: res.data.refresh_token,
            idToken: res.data.id_token,
        };
    } catch (err: any) {
        console.info(err);
        throw Error('Failed to fetch Google OAuth');
    }
}
