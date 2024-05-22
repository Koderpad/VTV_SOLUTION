// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAkKXsI4zMyROmgTxc19QMxyDPTO9FY_Mc",
  authDomain: "notification-vtv.firebaseapp.com",
  projectId: "notification-vtv",
  storageBucket: "notification-vtv.appspot.com",
  messagingSenderId: "306304042714",
  appId: "1:306304042714:web:be811369057196379487e3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const vapidKey = "BNTT1RPzw_ET_j-4-CLiC_LKfvRACwG_3M8dzABWp-UvhgWzrfCB-eGCT4G99K_RE0JotwXPyfUSw81WYzdJ7ho";

// Request permission to send notifications
export const requestForPermission = async () => {
  return await Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  })
}; 

export const requestForToken = async () => {
  return await getToken(messaging, { vapidKey})
    .then((currentToken: any) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
        return currentToken;
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

