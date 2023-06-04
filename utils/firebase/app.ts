/** utils/firebase/app.ts 
 * 
*/

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DB_URL,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DB_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export default app;
