import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://my.fsf.org/join">
        <a target="_blank" rel="noreferrer">
          <Image
            src="/images/262323.png"
            alt="Free Software Foundation"
            height={45}
            width={180}
            className={styles.resImg}
          />
        </a>
      </Link>
      <Link href="http://www.wtfpl.net/">
        <a target="_blank" rel="noreferrer">
          <Image
            src="/images/wtfpl-badge-1.png"
            alt="wtfpl"
            height={31}
            width={88}
            className={styles.resImg}
          />
        </a>
      </Link>
      <Link href="https://512kb.club">
        <a target="_blank" rel="noreferrer">
          <Image
            height={31}
            width={88}
            alt="512kb.club"
            src="https://512kb.club/assets/images/blue-team.svg"
          />
        </a>
      </Link>
    </footer>
  );
}
