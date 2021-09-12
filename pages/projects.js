import React from "react";
import Card from "../components/card";
import styles from "../styles/Projects.module.css";
// import { server } from '../config';
import { projectsData } from "./api/projects";

export default function Projects(props) {
  return (
    <div>
      <h2>Here are some projects I develop 🤹</h2>
      <div className={styles.gridContainer}>
        {props.data.projects.map((project, i) => (
          <div key={i} className={styles.gridItem}>
            <Card
              image={project.image}
              imageAlt={project.imageAlt}
              title={project.title}
              content={project.content}
              tags={project.tags}
              links={project.links}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  // const res = await fetch(`${server}/api/projects`);
  // const data = await res.json();
  const data = { projects: projectsData };

  return {
    props: { data },
  };
}
