import React from "react";
import styles from "../styles/Experience.module.css";

export default function Event({type, title, startDate, endDate, content, tags}) {
  return (
    <div className={styles.event}>
			<div className={styles.eventHeader}>
      	<p className={styles.etitle}>{type} {title}</p>
				<p className={styles.edate}>{startDate} {endDate && `- ${endDate}`}</p>
			</div>
      <p className={styles.etxt}>{content}</p>
			<p className={styles.etags}>{tags && tags.join(', ')}</p>
    </div>
  );
}
