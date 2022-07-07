import React from "react";
import Link from "next/link";
import styles from "../styles/Experience.module.css";
import Event from "../components/event";
import { experienceData } from "./api/experience";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Experience(props) {
  return (
    <>
      <h2>My journey 🤠</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
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
      <div className={styles.vtl}>
        {props.data.experience.map((ex, i) => (
          <Event
            key={i}
            type={ex.type}
            title={ex.title}
            startDate={ex.startDate}
            endDate={ex.endDate}
            content={ex.content}
            tags={ex.tags}
          />
        ))}
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  // const res = await fetch(`${server}/api/projects`);
  // const data = await res.json();
  const data = { experience: experienceData };

  return {
    props: { data },
  };
}
