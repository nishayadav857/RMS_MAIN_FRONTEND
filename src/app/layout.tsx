"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css";
import Header from "../components/Header";
import { useState } from "react";
import "../styles/globals.css";
import 'typicons.font/src/font/typicons.css'; // Importing Typicons CSS

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <html lang="en">
      <body>
        <nav className={`${styles.slideMenu} ${isMenuOpen ? styles.active : ''}`}>
          <ul>
            <li>
              <a href="/allresume">
                All Resume <i className="typcn typcn-chevron-right menu-arrow"></i>
              </a>
            </li>
            <li>
              <a href="/dashboard">
                Dashboard <i className="typcn typcn-chevron-right menu-arrow"></i>
              </a>
            </li>
            <li>
              <a href="/batchUpload">
                Batch Resume Upload <i className="typcn typcn-chevron-right menu-arrow"></i>
              </a>
            </li>
            <li>
              <a href="/jobDescription">
                Job Description Upload <i className="typcn typcn-chevron-right menu-arrow"></i>
              </a>
            </li>
            <li>
              <a href="/evaluation">
                Evaluate Candidate <i className="typcn typcn-chevron-right menu-arrow"></i>
              </a>
            </li>
          </ul>
        </nav>
        <Header toggleMenu={toggleMenu} />
        <div id="_next" className={styles.contentShifted}>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
