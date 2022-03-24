import "../styles/globals.scss";
import type { AppProps } from "next/app";

function ChatDemoApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ChatDemoApp;
