import React, { useEffect } from "react";
import Head from "next/head";
import styles from "../styles/whitepaper.module.css";

const WhitePaper: React.FC = () => {
  useEffect(() => {
    const resizeEmbed = () => {
      const embed = document.getElementById("pdfEmbed");
      if (embed) {
        const windowHeight = window.innerHeight;
        embed.style.height = `${windowHeight}px`;
      }
    };

    resizeEmbed();
    window.addEventListener("resize", resizeEmbed);
    return () => window.removeEventListener("resize", resizeEmbed);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WhitePaper</title>
      </Head>
      <div className={styles.container}>
        <embed
          id="pdfEmbed"
          src="/whitepaper.pdf"
          type="application/pdf"
          width="100%"
          height="100%"
          className={styles.embed}
        />
        <p className={styles.fallback}>
          If you cannot see the document, <a href="/whitepaper.pdf">download it here</a>.
        </p>
      </div>
    </>
  );
};

export default WhitePaper;
