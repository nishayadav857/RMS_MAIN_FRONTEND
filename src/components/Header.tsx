"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css"; // Import header styles

interface HeaderProps {
  toggleMenu: () => void;
  isMenuOpen: boolean; // Add isMenuOpen prop
}

export default function Header({ toggleMenu, isMenuOpen }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.hamburger} onClick={toggleMenu} role="button" aria-label="Toggle menu">
        {isMenuOpen ? (
          <span className={styles.closeIcon}><i className="typcn typcn-chevron-left menu-arrow"></i></span> // Close icon
        ) : (
          <>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </>
        )}
      </div>
      <div className={styles.logo}>
        <img src="/images/logo.png" alt="Company Logo" className={styles.logoImage}></img>
      </div>
    </header>
  );
}
