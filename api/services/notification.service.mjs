import axios from 'axios';

export const sendPushNotification = async (expoPushToken, message) => {
  try {
    await axios.post(
      'https://exp.host/--/api/v2/push/send',
      {
        to: expoPushToken,
        sound: 'default',
        title: message.title,
        body: message.body,
      },
      {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Notification sent!');
  } catch (error) {
    console.error(
      'Failed to send push notification:',
      error.response?.data || error.message,
    );
  }
};
