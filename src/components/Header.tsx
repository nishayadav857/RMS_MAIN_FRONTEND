"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css"; // Import header styles

interface HeaderProps {
  toggleMenu: () => void;
}

export default function Header({ toggleMenu }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Company Logo" className={styles.logoImage}></img>
      </div>
    </header>
  );
}
