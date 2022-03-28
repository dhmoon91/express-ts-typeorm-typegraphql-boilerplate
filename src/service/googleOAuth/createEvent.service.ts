import axios from 'axios';
// import qs from 'qs';

import { EventInput } from '../../types/EventInput';

// interface GoogleEvent {
//     start: { dateTime: string };
//     end: { dateTime: string };
//     summary: string;
//     description: string;
//     reminders: {
//         useDefault: boolean;
//         overrides: [{ method: string; minutes: number }];
//     };
// }

export const createEvent = async (
    eventData: EventInput,
    email: string,
    accessToken: string
) => {
    try {
        const bodyResource = {
            start: {
                dateTime: `${eventData.startDateTime}`,
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: `${eventData.endDateTime}`,
                timeZone: 'America/Los_Angeles',
            },
            summary: `${eventData.summary}`,
            description: `${eventData.description}`,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 60 },
                    { method: 'popup', minutes: 10 },
                ],
            },
        };

        const apikey = process.env.GOOGLE_API_KEY as string;

        const url = `https://www.googleapis.com/calendar/v3/calendars/${email}/events?key=${apikey}`;

        const resAPI = await axios.post(
            url,
            // qs.stringify({ key: process.env.GOOGLE_API_KEY as string }),
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                data: `${JSON.stringify(bodyResource)}`,
            }
        );

        console.info(resAPI);
        return true;
    } catch (err) {
        return null;
    }
};
