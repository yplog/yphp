import React from 'react';
import Link from "next/link";
import {
  faGithub,
  faKeybase,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../styles/Contact.module.css";

export default function Contact() {
  return (
    <section id={'contact'} className={styles.contactSection}>
          <section>
            <h2>Say Hello</h2>
            <ul>
              <li>
                <FontAwesomeIcon icon={faKey} />
                &nbsp;
                <Link href="/yps-public-key.txt">
                  <a target="_blank">E0AB D12B B3DE FCE5</a>
                </Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp; yp [at] riseup [dot] net
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp; yalinpala [at] protonmail [dot] com
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp; yalin.yp [at] gmail [dot] com
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
                  <a target="_blank">@yplog</a>
                </Link>
              </li>
              <FontAwesomeIcon icon={faKeybase} />
              &nbsp; Keybase:&nbsp;
              <Link href="https://keybase.io/yp">
                <a target="_blank">@yp</a>
              </Link>
              <li>
                <FontAwesomeIcon icon={faLinkedin} />
                &nbsp; Linkedin:&nbsp;
                <Link href="https://www.linkedin.com/in/yal%C4%B1n-pala-2426a3219/">
                  <a target="_blank">@yalınpala</a>
                </Link>
              </li>
            </ul>
          </section>
        </section>
  );
}