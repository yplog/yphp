import React from "react";
import Head from "next/head";

export default function HeadArea({ title = "yp's home page" }) {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content="Yalın Pala's Home Page" />
      <meta
        name="keywords"
        content="Yalın Pala, Software Developer, it's an adventure."
      />
      <meta name="author" content="Yalın Pala" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
