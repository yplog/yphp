import HeadArea from '../components/headArea';
import Header from '../components/header';
import About from '../components/about';
import Contact from "../components/contact";
import Footer from '../components/footer';
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <HeadArea />
      <Header />

      <section className={styles.content}>
        <About />
        <hr />
        <Contact />
      </section>
      <hr />
      <Footer />
    </div>
  );
}
