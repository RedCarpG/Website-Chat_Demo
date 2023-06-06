import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, {
  useEffect,
} from "react";
import Head from "next/head";
import { ServerStyleSheet } from "styled-components";
import { auth, User, onAuthStateChanged, createNewUserProfile, userNotExist } from "../utils/database"
import Footer from "../components/Footer";

function ChatDemoApp({ Component, pageProps }: AppProps) {

  const sheet = new ServerStyleSheet()
  const styleTags = sheet.getStyleElement()

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

  return <>
    <Head>
      <meta
        name="description"
        content="A Web Chat demo application project created with Firebase, NextJS. Feel free to visit my Github page for source code."
      ></meta>
      <meta
        name="keywords"
        content="ReactJS, NextJS, Firebase, Web Chat, Web Application"
      ></meta>
      <meta name="author" content="RedCarpG"></meta>
      <title>Web Chat Room - RedCarpG </title>
      <link rel="shortcut icon" href="/favicon.ico" />
      <title>Chat Demo</title>
      {styleTags}
    </Head>
    <Component {...pageProps} />
    <Footer />
  </>;
}

export default ChatDemoApp;
