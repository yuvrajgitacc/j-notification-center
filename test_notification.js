import axios from 'axios';

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
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
  }
};

sendTestNotification();
