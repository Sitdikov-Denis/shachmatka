import ResidentialComplex from "./components/ResidentialComplex/ResidentialComplex";
import styles from "./components/Main.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <ResidentialComplex />
    </main>
  );
}
