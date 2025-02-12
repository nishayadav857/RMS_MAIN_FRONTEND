'use client'; // Marking this file as a client component

import styles from "../styles/Header.module.css";
import Sidebar from "./sidebar/page";

import { useState } from "react";
import "../styles/globals.css";
import 'typicons.font/src/font/typicons.css'; // Importing Typicons CSS
import AllResume from './allresume/page'; // Importing the All Resume component
import Dashboard from './dashboard/page'; // Importing the Dashboard component
import BatchUpload from './batchUpload/page'; // Importing the Batch Upload component
import JobDescription from './jobDescription/page'; // Importing the Job Description component
import Evaluation from './multistepform/page'; // Importing the Evaluation component
import DataTable from './DataTable/page'; // Importing the DataTable component
import WebSocket from './websocket/page';

export default function RootLayout({
  isMenuOpen,
  children,
}: Readonly<{
  isMenuOpen: boolean; // Accepting isMenuOpen as a prop
  children: React.ReactNode;
}>) {
  const [menuOpenState, setMenuOpenState] = useState(isMenuOpen); // Set default based on prop

  const handleMenuToggle = () => {
    setMenuOpenState(prev => {
      console.log("Menu state from handleMenuToggle => ", prev);
      return !prev;
    }); // Toggle the menu state
  };

  const [currentPage, setCurrentPage] = useState(''); // State for current page

  const handlePageChange = (page: string) => {
    setCurrentPage(page); // Update the current page
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'allresume':
        return <AllResume />;
      case 'dashboard':
        return <Dashboard />;
      case 'batchUpload':
        return <BatchUpload onNext={handlePageChange} />;
      case 'jobDescription':
        return <JobDescription />;
      case 'evaluation':
        return <Evaluation />;
      case 'dataTable':
        return <DataTable />;
      case 'websocket':
        return <WebSocket />;

      default:
        return children; // Render default children if no page is selected
    }
  };

  return (
    <html lang="en">
      <body>
        <div className="flex"> {/* Common parent div for Sidebar and content */}
          <Sidebar handlePageChange={handlePageChange} isMenuOpen={menuOpenState} toggleMenu={handleMenuToggle} />
          <div id="_next" style={{ flex: '1', maxWidth: menuOpenState ? '92vw' : '80vw' }}>  
            {renderContent()} {/* Render the selected page content */}
          </div>
        </div>
      </body>
    </html>
  );
}
