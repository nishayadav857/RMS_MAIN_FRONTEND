"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts"; // Importing necessary components for charts

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"; // Importing Shadcn table component

import { ChartConfig, ChartContainer } from "../../components/ui/chart"; // Ensure this path is correct
import styles from "../../styles/Dashboard.module.css";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"; // Corrected import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';

interface ChartData {
  jdCode: string;
  count: number;
}

const Dashboard = () => {

  const [selectedChartData, setSelectedChartData] = useState<ChartData[]>([]); // Data for selected candidates
  const [rejectedChartData, setRejectedChartData] = useState<ChartData[]>([]); // Data for rejected candidates
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]); // Data for line chart
  const [candidateCount, setCandidateCount] = useState(0);
  const [applicantsData, setApplicantsData] = useState<any[]>([]); // State for applicants data

  useEffect(() => {

    const fetchCandidateStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hr/candidates/status/count');
        const data = await response.json();
        console.log('API Response:', data); // Log the response to see its structure

        // Filter data for selected candidates
        const selectedData = [
          { name: 'MCQ', count: data['MCQ_SELECTED'] || 0 },
          { name: 'INTERVIEW', count: data['INTERVIEW_SELECTED'] || 0 },
          { name: 'SCREEN', count: data['SCREEN_SELECTED'] || 0 }
        ];

        // Filter data for rejected candidates
        const rejectedData = [
          { name: 'MCQ', count: data['MCQ_REJECTED'] || 0 },
          { name: 'INTERVIEW', count: data['INTERVIEW_REJECTED'] || 0 },
          { name: 'SCREEN', count: data['SCREEN_REJECTED'] || 0 }
        ];

        // Set the filtered data to the state
        setSelectedChartData(selectedData); // Update the state with the selected data
        setRejectedChartData(rejectedData); // Update the state with the rejected data
      } catch (error) {
        console.error('Error fetching candidate status:', error);
      }
    };

    const fetchCandidateCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/resume-evaluation');
        const data = await response.json();
        console.log('API Response:', data);
        setCandidateCount(data.length);
      } catch (error) {
        console.error('Error fetching candidates count:', error);
      }
    };

    const fetchApplicantsData = async () => { // New function to fetch applicants data
      try {
        const response = await fetch('http://localhost:8080/api/hr/applicants');
        const data = await response.json();
        console.log('Applicants API Response:', data);
        setApplicantsData(data); // Update state with fetched applicants data
      } catch (error) {
        console.error('Error fetching applicants data:', error);
      }
    };

    const fetchLineChartData = async () => {
      try {
        // const response = await fetch('http://localhost:8080/api/hr/applications/count/jd');
        const response = await fetch('http://localhost:8080/api/job-descriptions/jdcode-counts');

        const data = await response.json();
        console.log('Line Chart API Response:', data);

        // Transform the line chart data into the required format
        const formattedLineChartData = data.map(item => ({
          jdCode: item.jdCode, // Use the key as the name for the X-axis
          count: item.count, // Ensure value is treated as a number
        }));

        console.log('Formatted Line Chart Data:', formattedLineChartData); // Log the formatted data
        setLineChartData(formattedLineChartData); // Update the state with the formatted line chart data
      } catch (error) {
        console.error('Error fetching line chart data:', error);
      }
    };

    fetchCandidateCount();
    fetchCandidateStatus();
 fetchApplicantsData(); // Call to fetch applicants data
    fetchLineChartData();

  }, []);

  const defaultConfig: ChartConfig = {
    exampleKey: {
      label: "Example Label",
      color: "rgba(0, 123, 255, 0.6)", // Example color
    },
  };

  return (
    <div className={styles.dashboard}>

      <div className={styles.cardsWrapper}>
        <Card className="w-[210px] h-[130px] bg-green-500">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2 text-white">
            <FontAwesomeIcon icon={faChartBar} size="2x" />
            <CardTitle>Campaign Name</CardTitle>
            <h3>JLR</h3>
          </CardContent>
        </Card>
        <Card className="w-[210px] h-[130px] bg-cyan-500">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2 text-white">
            <FontAwesomeIcon icon={faUsers} size="2x" />
            <CardTitle>Total Number of Applicants</CardTitle>
            <h3>{candidateCount}</h3>
          </CardContent>
        </Card>
        <Card className="w-[210px] h-[130px] bg-amber-500">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2 text-white">
            <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
            <CardTitle>MCQ Conducted</CardTitle>
            <h3>10</h3> {/* Hardcoded value */}
          </CardContent>
        </Card>
        <Card className="w-[210px] h-[130px] bg-purple-500">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2 text-white">
            <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
            <CardTitle>Interview Conducted</CardTitle>
            <h3>5</h3> {/* Hardcoded value */}
          </CardContent>
        </Card>

      </div>
      <div className={styles.graphsContainer}>
        <div className={styles.lineChartWrapper}>
          <div className={styles.lineChart}>
            <h2>Selected Candidates Over Time</h2>
            <br></br>
            <LineChart data={lineChartData} width={600} height={300} margin={{ top: 10, right: 85 }}>
              <XAxis dataKey="jdCode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </div>
          <div className={styles.tableWrapper}>
            <h2>Applicants List</h2> {/* New heading for the applicants table */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', width: '100%', margin: '2vh' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Compatibility</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Job Description Number</TableHead>
                    <TableHead>Job Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicantsData.map((applicant) => (
                    <TableRow key={applicant.candidateEmail || applicant.name}>
                      <TableCell className="font-medium">{applicant.name}</TableCell>
                      <TableCell>{applicant.__email}</TableCell>
                      <TableCell>{applicant.compatibility}</TableCell>
                      <TableCell>{applicant.currentStatus}</TableCell>
                      <TableCell>{applicant.jd_number}</TableCell>
                      <TableCell>{applicant.jd_Role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>Total Applicants: {applicantsData.length}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table> {/* Rendering Shadcn table with applicants data */}
            </div>
          </div>
        </div>
        <div className={styles.rightSideWrapper}>
          <div className={styles.barGraphsWrapper}>
            <h2>Candidate Status</h2>
            <div className={styles.dashboardGraphsContainer}>
              {/* Chart for Selected Candidates */}
              <ChartContainer className="min-h-[200px] w-full" config={defaultConfig}>
                <BarChart data={selectedChartData} layout="vertical" className={styles.chartSize}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name={"Selected"} fill="rgba(0,0,255,0.6)" radius={4} barSize={50} />
                </BarChart>
              </ChartContainer>

              {/* Chart for Rejected Candidates */}
              <ChartContainer className="min-h-[200px] w-full" config={defaultConfig}>
                <BarChart data={rejectedChartData} layout="vertical" className={styles.chartSize}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name={"Rejected"} fill="rgba(255, 0, 0, 0.6)" radius={4} barSize={30} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
          <div className={styles.recentActivity}>
            <h2>Recent Activity</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;