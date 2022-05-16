import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://512kb.club">
        <a target="_blank" rel="noreferrer">
          <img src="https://512kb.club/assets/images/blue-team.svg" />
        </a>
      </Link>
      <Image
        src="/images/wtfpl-badge-1.png"
        alt="wtfpl"
        height={31}
        width={88}
        className={styles.resImg}
      />
      <Image
        src="/images/262323.png"
        alt="The Sandman 1989 Issue 18"
        height={31}
        width={88}
        className={styles.resImg}
      />
    </footer>
  );
}
