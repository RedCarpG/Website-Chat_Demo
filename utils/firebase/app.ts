/** utils/firebase/app.ts 
 * 
*/

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC482jtO0NMH_aOCuwHC6HzPmcLp37FeqI",
  authDomain: "chatdemo-e2489.firebaseapp.com",
  databaseURL: "https://chatdemo-e2489-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatdemo-e2489",
  storageBucket: "chatdemo-e2489.appspot.com",
  messagingSenderId: "668382150331",
  appId: "1:668382150331:web:cc0110341143d71ea3f39e",
  measurementId: "G-QD1JXQF2RX"
};

const app = initializeApp(firebaseConfig);
export default app;
