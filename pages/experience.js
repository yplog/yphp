import React from "react";
import styles from "../styles/Experience.module.css";
import Event from "../components/event";
import { experienceData } from "./api/experience";

export default function Experience(props) {
  return (
    <>
      <h2>My journey 🤠</h2>
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
