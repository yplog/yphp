import React from 'react'
import HeadArea from './headArea'
import Header from './header'
import Footer from './footer'
import styles from "../styles/Home.module.css";

export default function Layout({ children }) {
	return (
		<div className={styles.container}>
			<HeadArea />
      <Header />

			<section className={styles.content}>
				{children}
			</section>
			
			<hr />

			<Footer />
		</div>
	)
}
