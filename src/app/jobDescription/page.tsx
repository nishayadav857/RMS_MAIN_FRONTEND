'use client';

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';
import { Form } from "../../components/ui/form"; 
import { Input } from "../../components/ui/input"; 
import { Button } from "../../components/ui/button";

interface FileUpload {
    files: File;
    progress: number;
    status: string;
}

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
    numOpenings: number; // New field added
    jdcontent: string; // Retain this field for the payload but not in the form
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobDescription = () => {
    const [jobDescription, setJobDescription] = useState<JobDescriptionData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const onDrop = (acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        const nonPdfFiles = acceptedFiles.filter((file) => file.type !== "application/pdf");

        if (nonPdfFiles.length) {
            setErrorMessage("Only PDF files are allowed.");
            toast.error("Only PDF files are allowed.");
            return;
        } else {
            setErrorMessage("");
        }

        const newFiles = pdfFiles.map((file) => ({
            files: file,
            progress: 0,
            status: "Uploading",
        }));

        if (newFiles.length) setUploading(true);

        setFiles((prev) => [...prev, ...newFiles]);
        uploadAllFiles(newFiles);
    };

    const uploadAllFiles = (fileObjects: FileUpload[]) => {
        fileObjects.forEach((fileObj) => {
            const formData = new FormData();
            formData.append("file", fileObj.files);

            axios
                .post("http://localhost:8080/api/job-descriptions/upload", formData, {
                    onUploadProgress: (event) => {
                        const percentage = Math.round((event.loaded / (event.total || 1)) * 100);
                        setFiles((prevFiles) =>
                            prevFiles.map((file) =>
                                file.files.name === fileObj.files.name
                                    ? { ...file, progress: percentage }
                                    : file
                            )
                        );
                    },
                })
                .then(() => {
                    setFiles((prev) =>
                        prev.map((file) =>
                            file.files.name === fileObj.files.name
                                ? { ...file, status: "Completed", progress: 100 }
                                : file
                        )
                    );
                    toast.success("Upload successful!"); 
                    fetchJobDescription(fileObj.files.name); 

                    checkIfUploadingComplete();
                })
                .catch((error) => {
                    setFiles((prev) =>
                        prev.map((file) =>
                            file.files.name === fileObj.files.name
                                ? { ...file, status: "Failed", progress: 0 }
                                : file
                        )
                    );
                    toast.error(`Upload failed: ${error.message}`); 
                    checkIfUploadingComplete();
                });
        });
    };

    const fetchJobDescription = async (filename: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/job-descriptions/${filename}`);
            setJobDescription(response.data);
            setIsModalOpen(true); // Open the modal after fetching job description
        } catch (error) {
            setError("Failed to fetch job description.");
            toast.error("Failed to fetch job description."); 
        } finally {
            setLoading(false);
        }
    };

    const checkIfUploadingComplete = () => {
        const unfinishedUploads = files.filter((file) => file.status === "Uploading");
        if (!unfinishedUploads.length) setUploading(false);
    };

    const cancelUpload = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.files.name !== fileName));
    };

    const handleSubmit = async () => {
        if (jobDescription) {
            try {
                await axios.put(`http://localhost:8080/api/job-descriptions/${jobDescription.filename}`, jobDescription);
                toast.success("Job description updated successfully!");
            } catch (error) {
                toast.error("Failed to update job description.");
            }
        }
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        accept: { "application/pdf": [] },
    });

    // Modal Component
    const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
                    maxHeight: "80vh", // Allow the modal to have a maximum height
                    overflowY: "auto", // Enable vertical scrolling
                }}>
                    <h2>Job Description Details</h2>
                    {jobDescription && (
                        <form onSubmit={handleSubmit}> {/* Changed to form element */}
                            <div>
                                <label>Filename:</label>
                                <Input type="text" value={jobDescription.filename} readOnly />
                            </div>
                            <div>
                                <label>Role:</label>
                                <Input type="text" value={jobDescription.role} onChange={(e) => setJobDescription({ ...jobDescription, role: e.target.value })} />
                            </div>
                            <div>
                                <label>Company Name:</label>
                                <Input type="text" value={jobDescription.companyName} onChange={(e) => setJobDescription({ ...jobDescription, companyName: e.target.value })} />
                            </div>
                            <div>
                                <label>Location:</label>
                                <Input type="text" value={jobDescription.location} onChange={(e) => setJobDescription({ ...jobDescription, location: e.target.value })} />
                            </div>
                            <div>
                                <label>Experience Minimum:</label>
                                <Input type="number" value={jobDescription.experienceMin} onChange={(e) => setJobDescription({ ...jobDescription, experienceMin: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Experience Maximum:</label>
                                <Input type="number" value={jobDescription.experienceMax} onChange={(e) => setJobDescription({ ...jobDescription, experienceMax: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Number of Openings:</label>
                                <Input type="number" value={jobDescription.numOpenings} onChange={(e) => setJobDescription({ ...jobDescription, numOpenings: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Must Have Skills:</label>
                                <Input type="text" value={jobDescription.mustHaveSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, mustHaveSkills: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Good To Have Skills:</label>
                                <Input type="text" value={jobDescription.goodToHaveSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, goodToHaveSkills: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Education Requirement:</label>
                                <Input type="text" value={jobDescription.educationRequirement} onChange={(e) => setJobDescription({ ...jobDescription, educationRequirement: e.target.value })} />
                            </div>
                            <div>
                                <label>Certifications:</label>
                                <Input type="text" value={jobDescription.certifications.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, certifications: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Responsibilities:</label>
                                <Input type="text" value={jobDescription.responsibilities.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, responsibilities: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Soft Skills:</label>
                                <Input type="text" value={jobDescription.softSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, softSkills: e.target.value.split(", ") })} />
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
        <div
            style={{
                backgroundColor: "#ffffff",
                background: '#e8eff9',
                minHeight: "calc(100vh - 8vh)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "60vw",
            }}
        >
            <div
                style={{
                    display: "flex",
                    background: "white",
                    padding: "30px",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    maxWidth: "600px",
                    width: "100%",
                }}
            >
                {/* Left Section */}
                <div
                    style={{
                        flex: 1,
                        marginRight: "20px",
                    }}
                >
                    <h1
                        style={{
                            textAlign: "center",
                            color: "black",
                            marginBottom: "10px",
                        }}
                    >
                        Job Description Upload
                    </h1>
                    <hr style={{ color: "black" }} />
                    {errorMessage && (
                        <div
                            style={{
                                color: "red",
                                textAlign: "center",
                                marginBottom: "10px",
                            }}
                        >
                            {errorMessage}
                        </div>
                    )}
                    <div
                        {...getRootProps()}
                        style={{
                            border: "2px dashed grey",
                            padding: "40px",
                            textAlign: "center",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginBottom: "10px",
                        }}
                    >
                        <input {...getInputProps()} />
                        <div>
                            <div
                                style={{
                                    fontSize: "50px",
                                    color: "#4caf50",
                                    marginBottom: "10px",
                                    backgroundColor: "white",
                                    width: "60px",
                                    height: "60px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "5px",
                                    border: "2px solid #4caf50",
                                    margin: "0 auto",
                                }}
                            >
                                ⬆
                            </div>
                            <p style={{ color: "black" }}>Drag job descriptions to upload</p>
                        </div>
                    </div>
                    <button
                        onClick={open}
                        style={{
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            display: "block",
                            margin: "0 auto",
                        }}
                    >
                        Choose Job Description
                    </button>
                    {uploading && <h3 style={{ textAlign: "center", marginTop: "20px" }}>Uploading...</h3>}
                </div>

                {/* Right Section - Only show if there are uploaded files */}
                {loading && (
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
                        <div style={{ color: "white" }}>
                            <h2>Loading...</h2>
                            <div className="spinner" style={{
                                border: "4px solid rgba(255, 255, 255, 0.3)",
                                borderTop: "4px solid white",
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                                animation: "spin 1s linear infinite"
                            }} />
                        </div>
                    </div>
                )}
                {files.length > 0 && jobDescription && (
                    <div
                        style={{
                            flex: 1,
                            maxHeight: "400px",
                            overflowY: "auto",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            background: "#f9f9f9",
                        }}
                    >
                        <h3 style={{ textAlign: "center", marginBottom: "10px", color: "black" }}>Job Description Details</h3>
                        <form onSubmit={handleSubmit}> {/* Changed to form element */}
                            <div>
                                <label>Filename:</label>
                                <Input type="text" value={jobDescription.filename} readOnly />
                            </div>
                            <div>
                                <label>Role:</label>
                                <Input type="text" value={jobDescription.role} onChange={(e) => setJobDescription({ ...jobDescription, role: e.target.value })} />
                            </div>
                            <div>
                                <label>Company Name:</label>
                                <Input type="text" value={jobDescription.companyName} onChange={(e) => setJobDescription({ ...jobDescription, companyName: e.target.value })} />
                            </div>
                            <div>
                                <label>Location:</label>
                                <Input type="text" value={jobDescription.location} onChange={(e) => setJobDescription({ ...jobDescription, location: e.target.value })} />
                            </div>
                            <div>
                                <label>Experience Minimum:</label>
                                <Input type="number" value={jobDescription.experienceMin} onChange={(e) => setJobDescription({ ...jobDescription, experienceMin: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Experience Maximum:</label>
                                <Input type="number" value={jobDescription.experienceMax} onChange={(e) => setJobDescription({ ...jobDescription, experienceMax: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Number of Openings:</label>
                                <Input type="number" value={jobDescription.numOpenings} onChange={(e) => setJobDescription({ ...jobDescription, numOpenings: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label>Must Have Skills:</label>
                                <Input type="text" value={jobDescription.mustHaveSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, mustHaveSkills: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Good To Have Skills:</label>
                                <Input type="text" value={jobDescription.goodToHaveSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, goodToHaveSkills: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Education Requirement:</label>
                                <Input type="text" value={jobDescription.educationRequirement} onChange={(e) => setJobDescription({ ...jobDescription, educationRequirement: e.target.value })} />
                            </div>
                            <div>
                                <label>Certifications:</label>
                                <Input type="text" value={jobDescription.certifications.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, certifications: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Responsibilities:</label>
                                <Input type="text" value={jobDescription.responsibilities.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, responsibilities: e.target.value.split(", ") })} />
                            </div>
                            <div>
                                <label>Soft Skills:</label>
                                <Input type="text" value={jobDescription.softSkills.join(", ")} onChange={(e) => setJobDescription({ ...jobDescription, softSkills: e.target.value.split(", ") })} />
                            </div>
                            <Button type="submit">Submit Changes</Button>
                        </form>
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> {/* Modal for displaying job description */}
            <ToastContainer /> 
        </div>
    );
};

export default JobDescription;
