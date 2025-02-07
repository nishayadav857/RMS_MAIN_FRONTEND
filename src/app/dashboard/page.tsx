"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import React, { useEffect, useState } from "react";
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
import { faClipboardCheck, faUserCheck, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';

interface ChartData {
  name: string;
  count: number;
}

const Dashboard = () => {
  const [selectedChartData, setSelectedChartData] = useState<ChartData[]>([]); // Data for selected candidates
  const [rejectedChartData, setRejectedChartData] = useState<ChartData[]>([]); // Data for rejected candidates
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]); // Data for line chart
  const [candidateCount, setCandidateCount] = useState(0);

  useEffect(() => {
    const fetchCandidateStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hr/candidates/status/count');
        const data = await response.json();
        console.log('API Response:', data); // Log the response to see its structure

        // Transform the object into an array
        const formattedData = Object.entries(data).map(([status, count]) => ({
          name: status, // Use the status as the name for the X-axis
          count: Number(count), // Ensure count is treated as a number
        }));

        // Filter data for selected and rejected candidates
        const selectedStatuses = ['MCQ_SELECTED', 'INTERVIEW_SELECTED', 'SCREEN_SELECTED'];
        const rejectedStatuses = ['INTERVIEW_REJECTED', 'MCQ_REJECTED', 'SCREEN_REJECTED'];

        const selectedData = formattedData.filter(item => selectedStatuses.includes(item.name));
        const rejectedData = formattedData.filter(item => rejectedStatuses.includes(item.name));

        setSelectedChartData(selectedData); // Update the state with the selected data
        setRejectedChartData(rejectedData); // Update the state with the rejected data
      } catch (error) {
        console.error('Error fetching candidate status:', error);
      }
    };

    const fetchCandidateCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hr/applicants');
        const data = await response.json();
        console.log('API Response:', data);
        setCandidateCount(data.length);
      } catch (error) {
        console.error('Error fetching candidates count:', error);
      }
    };

    const fetchLineChartData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hr/applications/count/jd');
        const data = await response.json();
        console.log('Line Chart API Response:', data);
        
        // Transform the line chart data into the required format
        const formattedLineChartData = Object.entries(data).map(([key, value]) => ({
          name: key, // Use the key as the name for the X-axis
          count: Number(value), // Ensure value is treated as a number
        }));

        console.log('Formatted Line Chart Data:', formattedLineChartData); // Log the formatted data
        setLineChartData(formattedLineChartData); // Update the state with the formatted line chart data
      } catch (error) {
        console.error('Error fetching line chart data:', error);
      }
    };

    fetchCandidateCount();
    fetchCandidateStatus();
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
        <Card className="w-[230px] h-[150px]">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2">
            <FontAwesomeIcon icon={faChartBar} size="2x" />
            <CardTitle>Campaign Name</CardTitle>
            <h3>JLR</h3>
          </CardContent>
        </Card>
        <Card className="w-[230px] h-[150px]">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2">
            <FontAwesomeIcon icon={faUsers} size="2x" />
            <CardTitle>Total Number of Applicants</CardTitle>
            <h3>{candidateCount}</h3>
          </CardContent>
        </Card>
        <Card className="w-[230px] h-[150px]">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2">
            <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
            <CardTitle>MCQ Conducted</CardTitle>
            <h3>10</h3> {/* Hardcoded value */}
          </CardContent>
        </Card>
        <Card className="w-[230px] h-[150px]">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-2">
            <FontAwesomeIcon icon={faUserCheck} size="2x" />
            <CardTitle>Interview Conducted</CardTitle>
            <h3>5</h3> {/* Hardcoded value */}
          </CardContent>
        </Card>
      </div>
      <div className={styles.graphsContainer}>
        <div className={styles.lineChartWrapper}>
          <h2>Selected Candidates Over Time</h2>
          <LineChart data={lineChartData} className={styles.lineChartSize}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
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
                <Bar dataKey="count" fill="rgba(0,0,255,0.6)" radius={4} barSize={30} />
              </BarChart>
            </ChartContainer>

            {/* Chart for Rejected Candidates */}
            <ChartContainer className="min-h-[200px] w-full" config={defaultConfig}>
              <BarChart data={rejectedChartData} layout="vertical" className={styles.chartSize}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="rgba(255, 0, 0, 0.6)" radius={4} barSize={30} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
