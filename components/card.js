import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Card.module.css";

export default function Card({ image, imageAlt, title, content, links }) {
	return (
		<div className={styles.card}>
			<Image
				src={image ? image : '/images/projects/diy.png'}
				alt={imageAlt ? imageAlt : title}
				width={100}
				height={100}
				layout='responsive'
			/>
			<div className={styles.container}>
				<h4><b>{title}</b></h4>
				<p>{content}</p>
			</div>
			<div className={styles.action}>
				{
					(links || []).map((link, i) => (
						<div key={i}>
							<div>
								<FontAwesomeIcon icon={faLink} /> &nbsp;
								<Link href={link.url}>
									<a className={styles.links} target="_blank">{link.text}</a>
								</Link>
							</div>
							<br />
						</div>
					))
				}
			</div>
			<style jsx>{`
        a {
          color: black;
        }
      `}</style>
		</div>
	)
}
