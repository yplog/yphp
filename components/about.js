import React from "react";
import Link from "next/link";
import Image from "next/image";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <section id={"about"} className={styles.about}>
      <h2>Hi, I’m Yalın 👋</h2>
      <Image
        src="/images/pxArt.png"
        alt="pixel art Yalın"
        height={100}
        width={100}
      />
      <p>
        Let me introduce myself. I’m Yalın (<i>Sounds like: </i>
        <audio
          className={styles.audio}
          preload="auto"
          controls="controls"
          src="/name-pronunciation.ogg"
        />
        ). I was born in 1994. I’m a software developer living in Ankara,
        Turkey. I’m full of wonder and infinitely skeptical toward authority.
        I’ve graduated from the department of metallurgy and materials
        engineering. I can say Paul Graham’s book Hackers and Painters as the
        turning point in my life.
        <Link href="http://www.paulgraham.com/hackpaint.html">
          <a target="_blank" rel="noreferrer">
            *
          </a>
        </Link>
        . I improved myself as a software developer with the help of various
        courses and curiosity. I have worked in various freelance jobs.
        Sometimes it continues. I have been a member of FSF
        <Link href="https://www.fsf.org/">
          <a target="_blank" rel="noreferrer">
            *
          </a>
        </Link>{" "}
        since 2015 and in the same years I became the founder of Perl Mongers
        Ankara
        <Link href="https://www.pm.org/groups/649.html">
          <a target="_blank" rel="noreferrer">
            *
          </a>
        </Link>
        . I contribute to open source projects. I worked at a startup company
        for about a year and I sailed to the new world with the withdrawal of
        the investor. Then I worked at NYKS Software
        <Link href="https://nykssoft.com/">
          <a target="_blank" rel="noreferrer">
            *
          </a>
        </Link>{" "}
        for about a year. I am currently working as a software developer at
        Anayurt Teknoloji
        <Link href="https://www.anayurtteknoloji.com/">
          <a target="_blank" rel="noreferrer">
            *
          </a>
        </Link>{" "}
        and I am doing a master’s degree in Engineering Management. In my spare
        time I’m busy lazing
        <span className={styles.tooltip}>
          *
          <span className={styles.tooltiptext}>
            Remember: Let us be lazy in everything, except in loving and
            drinking, except in being lazy. <i>-G. E. Lessing</i>
          </span>
        </span>{" "}
        and developing projects. You can check my geek code for more
        information. This code was generated with version 3.1. Thanks for your
        time.
      </p>
      <div>
        <FontAwesomeIcon icon={faFile} />
        &nbsp; CV: &nbsp;
        <Link href="/resume.html">
          <a target="_blank" rel="noreferrer">
            html
          </a>
        </Link>
        &nbsp;
        <Link href="/resume.pdf">
          <a target="_blank" rel="noreferrer">
            pdf
          </a>
        </Link>
      </div>

      <p>
        GCS d- s-:- a- C+++ UL++&gt;++++ P+(++) L+++&gt;++++ E- W+++ N? o? K? w–
        O— M+ V? PS+++ PE– Y++&gt;+++ PGP++&gt;+++ t B? X R+&gt;+++ !tv
        b++&gt;+++ DI+ D+ G e++&gt;+++ h! r- y+
      </p>
    </section>
  );
}
