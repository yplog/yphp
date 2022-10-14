import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        src="/images/The-Sandman-1989-Issue-18.png"
        alt="The Sandman 1989 Issue 18"
        height={315}
        width={953}
        className={styles.resImg}
      />
      <nav className={styles.navLinks}>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/projects">
          <a>Projects</a>
        </Link>
        <Link href="/experience">
          <a>Experience</a>
        </Link>
        <Link href="/blog">
          <a>Blog</a>
        </Link>
      </nav>
    </header>
  );
}
