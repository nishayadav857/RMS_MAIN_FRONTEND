'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/Evaluation.module.css'; // Import the CSS file

const Evaluation = () => {
    const [jobDescriptions, setJobDescriptions] = useState<string[]>([]);
    const [selectedJD, setSelectedJD] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

    useEffect(() => {
        const fetchJobDescriptions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/job-descriptions/filenames');
                setJobDescriptions(response.data); // Assuming the response is an array of filenames
            } catch (error) {
                console.error('Error fetching job descriptions:', error);
            }
        };

        fetchJobDescriptions();
    }, []);

    const handleButtonClick = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            await axios.post(`http://localhost:8080/api/resume-evaluation/evaluate?filename=${selectedJD}`);
            toast.success('Resume evaluated successfully!');
        } catch (error: any) {
            console.error('Error sending filename:', error);
            toast.error(`Error during evaluation: ${error.message}`);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className={styles.evaluationContainer}>
            <h1>Evaluation Page</h1>
            <select className={styles.evaluationDropdown} value={selectedJD} onChange={(e) => setSelectedJD(e.target.value)}>
                <option value="">Select Job Description</option>
                {jobDescriptions.map((jd, index) => (
                    <option key={index} value={jd}>{jd}</option>
                ))}
            </select>
            <button className={styles.evaluationButton} onClick={handleButtonClick} disabled={!selectedJD || isLoading}>
                {isLoading ? "Loading..." : 'Evaluate'}
            </button>
            {isLoading && <img src="/images/loading.gif" alt="Loading..." />} {/* Loading GIF */}
            <ToastContainer />
        </div>
    );
};

export default Evaluation;
