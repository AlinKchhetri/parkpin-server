import axios from "axios";

export const sendNotification = async (token, title, body) => {
    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { data: 'test' },
    };

    const headers = {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
    };
    try {
        await axios.post('https://exp.host/--/api/v2/push/send', JSON.stringify(message), { headers });
        const response = 'sent'
        return response
    } catch (error) {
        console.log(error);
        return error;
    }
};