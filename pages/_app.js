// pages/_app.js
import React from 'react';
import '../styles/globals.css'; // optional but recommended

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
