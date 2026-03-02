const axios = require('axios');

const sendTestNotification = async () => {
  try {
    const response = await axios.post('https://j-notification-center.onrender.com/api/notifications', {
      icon: '🚀',
      title: 'Success!',
      body: 'Your custom J Notification Center is live.',
      category: 'System'
    });
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

sendTestNotification();
