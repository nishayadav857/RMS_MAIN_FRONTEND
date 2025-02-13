'use client';
 
import React, { useState } from "react";
import ResumeUploader from "../batchUpload/page";
import JobDescription from "../jobDescription/page";
import styles from "../../styles/Header.module.css";
 
const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [jdData, setJdData] = useState(null);
    const totalSteps = 2;
 
    const handleJdUpload = (data: any) => {
        setJdData(data);
        nextStep();
        console.log("Selected Job Description:", data);
    };
 
    const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));
 
    const renderContent = () => {
        switch (step) {
            case 1:
                return <JobDescription onNext={handleJdUpload} />;
            case 2:
                return (
                    <>
                        <h1>{jdData?.role}</h1> {/* Display the selected job description */}
                        <ResumeUploader onNext={() => { /* Handle resume upload */ }} jobDescriptionName={jdData?.filename} />
                    </>
                );
            default:
                return null;
        }
    };
 
    return (
        <div className={styles.multistepWrapper}>
            {/* Step Progress Bar */}
            <div className={styles.stepProgressBar}>
                <ul className={styles.stepItems}>
                    {[...Array(totalSteps)].map((_, index) => (
                        <li key={index} className={`${styles.stepItem} ${index < step ? styles.active : ''} ${index === step - 1 ? styles.current : ''}`}>
                            <span className={styles.stepCount}>{index + 1}</span>
                            <span className={styles.stepLabel}>{index === 0 ? "Job Description" : "Resume"}</span>
                        </li>
                    ))}
                </ul>
            </div>
 
            {/* Content Area */}
            <div className={`${styles.contentArea} flex flex-col justify-evenly h-full`}>
                {renderContent()}
 
                {/* Navigation Buttons */}
                <div className={styles.navigationButtons}>
                    {step > 1 && (
                        <button onClick={prevStep} className="relative inline-flex items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-sky-600 transition duration-300 ease-out border-2 border-sky-600 rounded-full shadow-md group">
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-sky-600 group-hover:translate-x-0 ease">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" transform="scale(-1, 1) translate(-21, 0)" />
                                </svg>
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-sky-600 text-lg transition-all duration-300 transform group-hover:translate-x-full ease">Previous</span>
                            <span className="relative invisible">Previous</span>
                        </button>
                    )}
 
                    {step < totalSteps && (
                        <button onClick={nextStep} className="relative inline-flex items-center justify-center p-4 px-12 py-3 overflow-hidden font-medium text-sky-600 transition duration-300 ease-out border-2 border-sky-600 rounded-full shadow-md group">
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-sky-600 group-hover:translate-x-0 ease">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-sky-600 text-lg transition-all duration-300 transform group-hover:translate-x-full ease">Next</span>
                            <span className="relative invisible">Next</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
 
export default MultiStepForm;
 