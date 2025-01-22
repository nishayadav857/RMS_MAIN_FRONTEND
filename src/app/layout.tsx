"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css";
import Header from "../components/Header";
import { useState } from "react";
import "../styles/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className={`${styles.slideMenu} ${styles.active}`}>
            <ul>
              <li><a href="/allresume">All Resume</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/batchUpload">Batch Resume Upload</a></li>
              <li><a href="/jobDescription">Job Description Upload</a></li>
              <li><a href="/evaluation">Evaluate Candidate</a></li>
            </ul>
          </nav>
        <Header />
        <div id="_next" className={styles.contentShifted}>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
