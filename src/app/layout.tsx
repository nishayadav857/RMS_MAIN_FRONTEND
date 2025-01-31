"use client"; // Marking this file as a client component
import styles from "../styles/Header.module.css";
import Header from "../components/Header";
import { useState } from "react";
import "../styles/globals.css";
import 'typicons.font/src/font/typicons.css'; // Importing Typicons CSS
import AllResume from './allresume/page'; // Importing the All Resume component
import Dashboard from './dashboard/page'; // Importing the Dashboard component
import BatchUpload from './batchUpload/page'; // Importing the Batch Upload component
import JobDescription from './jobDescription/page'; // Importing the Job Description component
import Evaluation from './evaluation/page'; // Importing the Evaluation component
import DataTable from './DataTable/page'; //Importing the DataTable component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(''); // State for current page

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page); // Update the current page
    // setIsMenuOpen(false); // Close the menu after selection
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'allresume':
        return <AllResume />;
      case 'dashboard':
        return <Dashboard />;
      case 'batchUpload':
        return <BatchUpload />;
      case 'jobDescription':
        return <JobDescription />;
      case 'evaluation':
        return <Evaluation />;
      case 'dataTable':
        return <DataTable />;
      default:
        return children; // Render default children if no page is selected
    }
  };

  return (
    <html lang="en">
      <body>
        <nav className={`${styles.slideMenu} ${isMenuOpen ? styles.active : ''}`}>
          <ul>
            <li>
              <button onClick={() => handlePageChange('dashboard')}>
                <svg className="h-8 w-8 text-blue-500 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <polyline points="5 12 3 12 12 3 21 12 19 12" />  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                Dashboard
              </button>
            </li>
            {/* <li>
              <button onClick={() => handlePageChange('allresume')}>
                <svg className="h-8 w-8 text-blue-500 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />  <rect x="9" y="3" width="6" height="4" rx="2" />  <line x1="9" y1="12" x2="9.01" y2="12" />  <line x1="13" y1="12" x2="15" y2="12" />  <line x1="9" y1="16" x2="9.01" y2="16" />  <line x1="13" y1="16" x2="15" y2="16" /></svg>
                Candidate Details
              </button>
            </li> */}
            <li>
              <button onClick={() => handlePageChange('dataTable')}>
                <svg className="h-8 w-8 text-blue-500 mr-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />  <rect x="9" y="3" width="6" height="4" rx="2" />  <line x1="9" y1="12" x2="9.01" y2="12" />  <line x1="13" y1="12" x2="15" y2="12" />  <line x1="9" y1="16" x2="9.01" y2="16" />  <line x1="13" y1="16" x2="15" y2="16" /></svg>
                DataTable Sample
              </button>
            </li>
            {/* <li>
              <button onClick={() => handlePageChange('batchUpload')}>
                Batch Resume Upload
              </button>
            </li>
            <li>
              <button onClick={() => handlePageChange('jobDescription')}>
                Job Description Upload
              </button>
            </li> */}
            <li>
              <button onClick={() => handlePageChange('evaluation')}>
              <svg className="h-8 w-8 text-blue-500 mr-2"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="3" y="12" width="6" height="8" rx="1" />  <rect x="9" y="8" width="6" height="12" rx="1" />  <rect x="15" y="4" width="6" height="16" rx="1" />  <line x1="4" y1="20" x2="18" y2="20" /></svg>
                Evaluate Candidate
              </button>
            </li>
          </ul>
        </nav>
        <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} /> {/* Pass isMenuOpen prop */}
        <div id="_next" className={isMenuOpen ? styles.contentShifted : ''}>
          {renderContent()} {/* Render the selected page content */}
        </div>
      </body>
    </html>
  );
}
