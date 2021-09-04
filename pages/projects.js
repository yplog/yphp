import React from 'react'
import Card from '../components/card';
import styles from "../styles/Projects.module.css";

export default function Projects() {
	return (
		<div>
			<h2>
				Projects 🤹
			</h2>
			<div className={styles.gridContainer}>
				<div className={styles.gridItem}>
					<Card
						image={'/images/projects/picate_logo.png'}
						imageAlt={'picate logo'}
						title={'Picate'}
						content={'Lets you search for photos and save them to your favorites. Uses Unsplash as the source of photos. Non-profit.'}
						links={[
							{ text: "Google Play", url: 'https://play.google.com/store/apps/details?id=site.picate.picate' },
							{ text: "Github", url: "https://github.com/yplog/picate" }
						]}
					/>
				</div>
				<div className={styles.gridItem}>
					<Card
						image={'/images/projects/niminy_logo.png'}
						imageAlt={'niminy logo'}
						title={'niminy'}
						content={'niminy is an extension that includes a number of functions to increase productivity. Users can specify durations that help to plan their working time.'}
						links={[
							{ text: "Market Place VSCode", url: 'https://marketplace.visualstudio.com/items?itemName=niminy.niminy' },
							{ text: "Github", url: "https://github.com/yplog/niminy" }
						]}
					/>
				</div>
				<div className={styles.gridItem}>
					<Card
						title={'rd-dd'}
						content={'This script compares the files in the PostgreSQL database with the file assets in the directory. Deletes files that are not in the database.'}
						links={[
							{ text: "Github", url: 'https://github.com/yplog/rd-dd' },
						]}
					/>
				</div>
				<div className={styles.gridItem}>
					<Card
						image={'/images/projects/tasko_logo.png'}
						imageAlt={'tasko logo'}
						title={'Tasko'}
						content={'Distributed to-do list application running on BlockStack.'}
						links={[
							{ text: "Site", url: 'https://cocky-bardeen-6c4387.netlify.app/' },
							{ text: "Github", url: "https://github.com/yplog/tasko" }
						]}
					/>
				</div>
				<div className={styles.gridItem}>
					<Card
						image={'/images/projects/eff_dice_logo.png'}
						imageAlt={'eff dice logo'}
						title={'EFF Dice-Generated Passphrases'}
						content={"Create strong passphrases with EFF's new random number generators!"}
						links={[
							{ text: "EFF", url: 'https://www.eff.org/dice' },
							{ text: "Github", url: "https://github.com/yplog/EFF-Dice-Generated-Passphrases" }
						]}
					/>
				</div>
				<div className={styles.gridItem}>
					<Card
						image={'/images/projects/camelia_logo.png'}
						imageAlt={'camelia logo'}
						title={'Raku Guide'}
						content={"This document is intended to give you a quick overview of the Raku programming language."}
						links={[
							{ text: "raku.guide/tr", url: 'https://raku.guide/tr/' },
							{ text: "Github", url: "https://github.com/hankache/rakuguide" }
						]}
					/>
				</div>
			</div>
		</div>
	)
}
