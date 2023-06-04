import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, {
  useEffect,
} from "react";
import { auth, User, onAuthStateChanged, createNewUserProfile, userNotExist } from "../utils/database"

function ChatDemoApp({ Component, pageProps }: AppProps) {

  async function checkUserFirstLogin(user: User) {
    if (await userNotExist(user.uid)) {
      console.log("Create User");
      createNewUserProfile(user);
    }
  }
  useEffect(() => {
    // Bound onAuthStateChanged callback
    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserFirstLogin(user);
        console.log(`Logged in: ${user.uid}`);
      } else {
        console.log(`Logged out`);
      }
    })
  }, [])

  return <Component {...pageProps} />;
}

export default ChatDemoApp;
