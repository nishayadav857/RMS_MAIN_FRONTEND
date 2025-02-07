'use client';

import React, { useState } from "react";
import ResumeUploader from "../batchUpload/page";
import JobDescription from "../jobDescription/page";
import Evaluation from "../evaluation/page";
import styles from "../../styles/Header.module.css"; // Assuming you have styles for the slide menu

const MultiStepForm = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [resumeData, setResumeData] = useState(null);
    const [jdData, setJdData] = useState(null);
    const totalSteps = 3; // Total number of steps

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleResumeUpload = (data: any) => { // Explicitly typed as any
        setResumeData(data);
        nextStep();
    };

    const handleJdUpload = (data: any) => { // Explicitly typed as any
        setJdData(data);
        nextStep();
    };

    const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

    const renderContent = () => {
        switch (step) {
            case 1:
                return <ResumeUploader onNext={handleResumeUpload} />; // Ensure onNext is correctly typed
            case 2:
                return <JobDescription onNext={handleJdUpload} />; // Ensure onNext is correctly typed
            case 3:
                return <Evaluation />;
            default:
                return null; // Render nothing if no step is selected
        }
    };

    const progressPercentage = (step / totalSteps) * 100; // Calculate progress percentage

    return (
        <div className={styles.multistepWrapper}>
            <nav className={`${styles.slideMenu1} ${isMenuOpen ? styles.active : ''}`}>
                <div style={{ width: '100%', backgroundColor: 'whitesmoke', borderRadius: '40px', marginBottom: '20px' }}>
                    Progress
                    <div style={{ width: `${progressPercentage}%`, backgroundColor: 'green', height: '10px', borderRadius: '40px' }} /><span>{progressPercentage.toFixed(0)}</span>
                </div>
                <ol>
                    <li>
                        <button onClick={() => setStep(1)}>
                            Resume Upload
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setStep(2)}>
                            JD Upload
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setStep(3)}>
                            Evaluate
                        </button>
                    </li>
                </ol>
            </nav>

            <div className={isMenuOpen ? styles.contentShifted : ''}>
                {renderContent()}

                <div style={{ position: "absolute", bottom: "5vh", textAlign: "center", width: "60vw", display: "flex", justifyContent: "space-around" }}>
                    {step > 1 && <button onClick={prevStep} style={{ backgroundColor: "#000b73", color: "white", padding: "1em", borderRadius: "0.9em", width: "100px" }}>Previous</button>}
                    {step < totalSteps && <button onClick={nextStep} style={{ backgroundColor: "#000b73", color: "white", padding: "1em", borderRadius: "0.9em", width: "100px" }}>Next</button>}
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;
