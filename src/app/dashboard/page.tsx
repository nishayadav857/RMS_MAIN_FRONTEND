"use client";

import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import React, { useEffect, useState } from "react";
import { ChartConfig, ChartContainer } from "../../components/ui/chart"; // Ensure this path is correct
import styles from "../../styles/Dashboard.module.css";
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Dashboard = () => {
  const [selectedChartData, setSelectedChartData] = useState([]); // Data for selected candidates
  const [rejectedChartData, setRejectedChartData] = useState([]); // Data for rejected candidates

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
          count: count, // Use the count for the Y-axis
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

    const fetchCandidateCount = async () =>{
      try{
        const response = await fetch('http://localhost:8080/api/hr/applicants');
        const data = await response.json();
        console.log('API Response:', data);
        setCandidateCount(data.length);
      }catch(error)
      {
        console.error('Error fetching candidates count:', error);
      }
    }

    fetchCandidateCount();
    fetchCandidateStatus();
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
      <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">Campaign Name</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <h3>JLR</h3>
          </CardContent>
        </Card>
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">Total Number of Applicants</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <h3>{candidateCount}</h3>
          </CardContent>
        </Card>
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="text-center">Total Number of Applicants</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <h3>{candidateCount}</h3>
          </CardContent>
        </Card>
      </div>
      <div className="barGraphsWrapper" style={{marginLeft: "2.5vw"}}>
        <h2>Candidate Status</h2>
        <div className={styles.dashboardGraphsContainer}>
          {/* Chart for Selected Candidates */}
          <ChartContainer className="min-h-[200px] w-full" config={defaultConfig}>
            <BarChart data={selectedChartData} width={100} height={300}> {/* Set width and height here */}
              <XAxis dataKey="name" /> {/* X-axis using the 'name' field */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="rgba(0,0,255,0.6)" radius={4} barSize={50} /> {/* Y-axis using the 'count' field */}
            </BarChart>
          </ChartContainer>

          {/* Chart for Rejected Candidates */}
          <ChartContainer className="min-h-[200px] w-full" config={defaultConfig}>
            <BarChart data={rejectedChartData} width={600} height={300}> {/* Set width and height here */}
              <XAxis dataKey="name" /> {/* X-axis using the 'name' field */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="rgba(255, 0, 0, 0.6)" radius={4} barSize={50} /> {/* Y-axis using the 'count' field */}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;