import React from "react";
import Link from "next/link";
import {
  faGithub,
  faKeybase,
  faLinkedin,
  faMastodon,
  faHackerrank
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../styles/Contact.module.css";

export default function Contact() {
  return (
    <section id={"contact"} className={styles.contactSection}>
      <section>
        <h2>Say Hello</h2>
        <ul>
          <li>
            <FontAwesomeIcon icon={faKey} />
            &nbsp;
            <Link href="/yps-public-key.txt">
              <a target="_blank" rel="noreferrer">E0AB D12B B3DE FCE5</a>
            </Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} />
            &nbsp; me [at] yalinpala [dot] dev
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} />
            &nbsp; yp [at] riseup [dot] net
          </li>
        </ul>
      </section>
      <section>
        <h2>Links</h2>
        <ul>
          <li>
            <FontAwesomeIcon icon={faGithub} />
            &nbsp; Github:&nbsp;
            <Link href="https://github.com/yplog">
              <a target="_blank" rel="noreferrer">@yplog</a>
            </Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faLinkedin} />
            &nbsp; Linkedin:&nbsp;
            <Link href="https://www.linkedin.com/in/yal%C4%B1n-pala-2426a3219/">
              <a target="_blank" rel="noreferrer">@yalınpala</a>
            </Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faHackerrank} />
            &nbsp; HackerRank:&nbsp;
            <Link href="https://www.hackerrank.com/ypala">
              <a target="_blank" rel="noreferrer">@ypala</a>
            </Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faMastodon} />
            &nbsp; Mastodon:&nbsp;
            <Link href="https://kolektiva.social/@yp">
              <a target="_blank" rel="me" >@yp</a>
            </Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faKeybase} />
            &nbsp; Keybase:&nbsp;
            <Link href="https://keybase.io/yp">
              <a target="_blank" rel="noreferrer">@yp</a>
            </Link>
          </li>
          
        </ul>
      </section>
    </section>
  );
}
