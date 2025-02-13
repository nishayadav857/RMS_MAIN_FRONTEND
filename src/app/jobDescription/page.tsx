'use client';
 
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import styles from '../../styles/JobDescription.module.css'; // Import your styles
 
interface JobDescriptionData {
    role: string;
    companyName: string;
    location: string;
    experienceMin: number;
    experienceMax: number;
    mustHaveSkills: string[];
    goodToHaveSkills: string[];
    educationRequirement: string;
    certifications: string[];
    responsibilities: string[];
    softSkills: string[];
    filename: string;
    numOpenings: number;
}
 
const JobDescription = ({ onNext }: { onNext: (jd: JobDescriptionData) => void }) => {
    const [jobDescriptions, setJobDescriptions] = useState<string[]>([]);
    const [selectedJD, setSelectedJD] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<JobDescriptionData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the file input
 
    // Refs for form inputs
    const roleRef = useRef<HTMLInputElement | null>(null);
    const companyNameRef = useRef<HTMLInputElement | null>(null);
    const locationRef = useRef<HTMLInputElement | null>(null);
    const experienceMinRef = useRef<HTMLInputElement | null>(null);
    const experienceMaxRef = useRef<HTMLInputElement | null>(null);
    const numOpeningsRef = useRef<HTMLInputElement | null>(null);
    const mustHaveSkillsRef = useRef<HTMLInputElement | null>(null);
    const goodToHaveSkillsRef = useRef<HTMLInputElement | null>(null);
    const educationRequirementRef = useRef<HTMLInputElement | null>(null);
    const certificationsRef = useRef<HTMLInputElement | null>(null);
    const responsibilitiesRef = useRef<HTMLInputElement | null>(null);
    const softSkillsRef = useRef<HTMLInputElement | null>(null);
 
    useEffect(() => {
        fetchJobDescriptions();
    }, []);
 
    const fetchJobDescriptions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/job-descriptions/filenames');
            setJobDescriptions(response.data);
        } catch (error) {
            console.error('Error fetching job descriptions:', error);
        }
    };
 
    const handleSelectJobDescription = async () => {
        if (!selectedJD) {
            toast.error("Please select a job description.");
            return;
        }
 
        try {
            const response = await axios.get<JobDescriptionData>(`http://localhost:8080/api/job-descriptions/${selectedJD}`);
            setJobDescription(response.data);
            setIsModalOpen(true); // Open the modal after fetching job description
        } catch (error) {
            toast.error("Failed to fetch job description.");
        }
    };
 
    const onDrop = async (acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        const nonPdfFiles = acceptedFiles.filter((file) => file.type !== "application/pdf");
 
        if (nonPdfFiles.length) {
            toast.error("Only PDF files are allowed.");
            return;
        }
 
        for (const file of pdfFiles) {
            const formData = new FormData();
            formData.append("file", file);
 
            try {
                await axios.post("http://localhost:8080/api/job-descriptions/upload", formData);
                toast.success(`Uploaded ${file.name} successfully!`);
                await fetchJobDescriptions();
                const response = await axios.get<JobDescriptionData>(`http://localhost:8080/api/job-descriptions/${file.name}`);
                setJobDescription(response.data);
                setIsModalOpen(true);
            } catch (error) {
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
            }
        }
    };
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior
 
        // Ensure formData is populated correctly
        const formData: JobDescriptionData = {
            role: roleRef.current?.value || "",
            companyName: companyNameRef.current?.value || "",
            location: locationRef.current?.value || "",
            experienceMin: Number(experienceMinRef.current?.value) || 0,
            experienceMax: Number(experienceMaxRef.current?.value) || 0,
            numOpenings: Number(numOpeningsRef.current?.value) || 0,
            mustHaveSkills: mustHaveSkillsRef.current?.value.split(",").map(item => item.trim()) || [],
            goodToHaveSkills: goodToHaveSkillsRef.current?.value.split(",").map(item => item.trim()) || [],
            educationRequirement: educationRequirementRef.current?.value || "",
            certifications: certificationsRef.current?.value.split(",").map(item => item.trim()) || [],
            responsibilities: responsibilitiesRef.current?.value.split(",").map(item => item.trim()) || [],
            softSkills: softSkillsRef.current?.value.split(",").map(item => item.trim()) || [],
            filename: jobDescription?.filename || "", // Use the filename from jobDescription
        };
 
        // Log the filename and URL for debugging
        console.log("Submitting to URL:", `http://localhost:8080/api/job-descriptions/${formData.filename}`);
        console.log("Form Data:", formData);
 
        try {
            const response = await axios.put(`http://localhost:8080/api/job-descriptions/${formData.filename}`, formData);
            toast.success("Job description updated successfully!");
            onNext(formData); // Call onNext with the updated job description
            setIsModalOpen(false); // Close the modal after submission
        } catch (error) {
            toast.error("Failed to update job description.");
            console.error("Error updating job description:", error.response ? error.response.data : error.message);
        }
    };
 
    const Modal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
 
        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}>
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "80%",
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}>
                    <h2>Job Description Details</h2>
                    {jobDescription && (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Filename:</label>
                                <Input type="text" value={jobDescription.filename} readOnly />
                            </div>
                            <div>
                                <label>Role:</label>
                                <Input type="text" ref={roleRef} defaultValue={jobDescription.role} />
                            </div>
                            <div>
                                <label>Company Name:</label>
                                <Input type="text" ref={companyNameRef} defaultValue={jobDescription.companyName} />
                            </div>
                            <div>
                                <label>Location:</label>
                                <Input type="text" ref={locationRef} defaultValue={jobDescription.location} />
                            </div>
                            <div>
                                <label>Experience Minimum:</label>
                                <Input type="number" ref={experienceMinRef} defaultValue={jobDescription.experienceMin} />
                            </div>
                            <div>
                                <label>Experience Maximum:</label>
                                <Input type="number" ref={experienceMaxRef} defaultValue={jobDescription.experienceMax} />
                            </div>
                            <div>
                                <label>Number of Openings:</label>
                                <Input type="number" ref={numOpeningsRef} defaultValue={jobDescription.numOpenings} />
                            </div>
                            <div>
                                <label>Must Have Skills:</label>
                                <Input type="text" ref={mustHaveSkillsRef} defaultValue={jobDescription.mustHaveSkills.join(", ")} />
                            </div>
                            <div>
                                <label>Good To Have Skills:</label>
                                <Input type="text" ref={goodToHaveSkillsRef} defaultValue={jobDescription.goodToHaveSkills.join(", ")} />
                            </div>
                            <div>
                                <label>Education Requirement:</label>
                                <Input type="text" ref={educationRequirementRef} defaultValue={jobDescription.educationRequirement} />
                            </div>
                            <div>
                                <label>Certifications:</label>
                                <Input type="text" ref={certificationsRef} defaultValue={jobDescription.certifications.join(", ")} />
                            </div>
                            <div>
                                <label>Responsibilities:</label>
                                <Input type="text" ref={responsibilitiesRef} defaultValue={jobDescription.responsibilities.join(", ")} />
                            </div>
                            <div>
                                <label>Soft Skills:</label>
                                <Input type="text" ref={softSkillsRef} defaultValue={jobDescription.softSkills.join(", ")} />
                            </div>
                            <Button type="submit">Submit Changes</Button>
                        </form>
                    )}
                    <button onClick={onClose} style={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}>
                        Close
                    </button>
                </div>
            </div>
        );
    };
 
    return (
        <div className={styles.jobDescriptionContainer}>
            <h1>Job Description Selection</h1>
            <select value={selectedJD} onChange={(e) => setSelectedJD(e.target.value)}>
                <option value="">Select Job Description</option>
                {jobDescriptions.map((jd, index) => (
                    <option key={index} value={jd}>{jd}</option>
                ))}
            </select>
            <Button onClick={handleSelectJobDescription}>Select Job Description</Button>
            <Button onClick={() => fileInputRef.current?.click()}>Upload New Job Description</Button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the file input
                accept="application/pdf"
                onChange={(e) => {
                    if (e.target.files) {
                        onDrop(Array.from(e.target.files)); // Call onDrop with the selected files
                    }
                }}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ToastContainer />
        </div>
    );
};
 
export default JobDescription;
 
 