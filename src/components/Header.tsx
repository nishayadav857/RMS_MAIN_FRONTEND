"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css"; // Import header styles

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Company Logo" className={styles.logoImage}></img>
      </div>
    </header>
  );
}
