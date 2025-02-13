'use client';
 
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
 
interface FileUpload {
    files: File;
    progress: number;
    status: string;
}
 
const ResumeUploader = ({ onNext, jobDescriptionName }: { onNext: (data: any) => void, jobDescriptionName: string }) => {
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for evaluation
 
    const onDrop = (acceptedFiles: File[]) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        const nonPdfFiles = acceptedFiles.filter((file) => file.type !== "application/pdf");
 
        if (nonPdfFiles.length) {
            setErrorMessage("Only PDF files are allowed.");
            toast.error("Only PDF files are allowed.", { className: 'custom-toast' });
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
        const formData = new FormData();
        fileObjects.forEach(fileObj => {
            formData.append("files", fileObj.files);
        });
 
        axios
            .post(`http://localhost:8080/api/uploadAll?jobDescriptionFilename=${jobDescriptionName}`
 , formData, {
                onUploadProgress: (event) => {
                    const total = event.total || 0;
                    const loaded = event.loaded;
                    const percentage = Math.round((loaded / total) * 100);
 
                    setFiles((prevFiles) =>
                        prevFiles.map((file) => ({
                            ...file,
                            progress: percentage
                        }))
                    );
                },
            })
            .then((response) => {
                const existingFiles = response.data.existingFiles;
 
                setFiles((prev) =>
                    prev.map((f) => ({
                        ...f,
                        status: existingFiles.includes(f.files.name) ? "Already Exists" : "Completed",
                        progress: 100
                    }))
                );
 
                if (existingFiles.length) {
                    const toastMessage = (
                        <div style={{ textAlign: 'left' }}>
                            <p>The following files already exist:</p>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                {existingFiles.map((file, index) => (
                                    <li key={index}>{file}</li>
                                ))}
                            </ul>
                        </div>
                    );
 
                    toast.warning(toastMessage, { className: 'custom-toast' });
                } else {
                    toast.success("All resumes uploaded successfully.", { className: 'custom-toast' });
                }
 
                checkIfUploadingComplete();
                setTimeout(() => {
                    onNext(fileObjects); // Call onNext with the fileObjects
                }, 2000); // Wait for 2 seconds before navigating
 
            })
            .catch((error) => {
                setFiles((prev) =>
                    prev.map((f) => ({
                        ...f,
                        status: "Failed",
                        progress: 0
                    }))
                );
                setErrorMessage(`Upload failed: ${error.response ? error.response.data.message : error.message}`);
                toast.error(`Upload failed: ${error.response ? error.response.data.message : error.message}`, { className: 'custom-toast' });
                checkIfUploadingComplete();
            });
    };
 
    const checkIfUploadingComplete = () => {
        const unfinishedUploads = files.filter((file) => file.status === "Uploading");
        if (!unfinishedUploads.length) setUploading(false);
    };
 
    const cancelUpload = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.files.name !== fileName));
    };
 
    const handleEvaluateClick = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            await axios.post(`http://localhost:8080/api/resume-evaluation/evaluate?filename=${jobDescriptionName}`);
            toast.success('Resume evaluated successfully!');
        } catch (error: any) {
            console.error('Error sending filename:', error);
            toast.error(`Error during evaluation: ${error.message}`);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };
 
    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        accept: {
            'application/pdf': []
        },
    });
 
    return (
        <div>
            <div className="container mx-auto mt-6">
                <h1 className="font-semibold text-center text-xl mb-3">
                    Upload Resume
                </h1>
                <hr style={{ color: "black" }} />
                {errorMessage && (
                    <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
                        {errorMessage}
                    </div>
                )}
                <div
                    {...getRootProps()}
                    className="border-dashed border-2 border-gray-400 rounded-md p-10 text-center cursor-pointer mb-3 relative"
                >
                    <input {...getInputProps()} />
                    <div>
                        <div
                            onClick={open}
                            className="text-3xl text-green-500 mb-3 w-14 flex justify-center items-center rounded border-2 border-green-500 border-solid mx-auto"
                        >
                            ⬆
                        </div>
                        <p style={{ color: "black" }}>Drag resumes to upload</p>
                    </div>
                </div>
                {uploading && <h3 style={{ marginTop: "20px" }}>Uploading...</h3>}
                {files.length > 0 && (
                    <ul style={{ marginTop: "20px", listStyle: "none", padding: '0px', color: "black", maxHeight: "200px", overflowY: "auto" }}>
                        {files.map((file: FileUpload, index: number): JSX.Element => (
                            <li key={index} style={{ marginBottom: "15px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ flexGrow: 1 }}>
                                        {file.files.name} - {file.status} ({file.progress}%)
                                    </span>
                                    <button
                                        onClick={() => cancelUpload(file.files.name)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "red",
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                                <div style={{ background: "#e0e0e0", height: "5px", width: "100%", borderRadius: "3px" }}>
                                    <div
                                        style={{
                                            width: `${file.progress}%`,
                                            height: "5px",
                                            background: file.status === "Completed" ? "green" : file.status === "Failed" ? "red" : "#4a90e2",
                                            borderRadius: "3px",
                                            transition: "width 0.5s ease",
                                        }}
                                    ></div>
                                </div>
                                <div style={{ height: "10px" }}></div>
                            </li>
                        ))}
                    </ul>
                )}
                {/* Evaluate Button */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button onClick={handleEvaluateClick} disabled={isLoading}>
                        {isLoading ? "Loading..." : 'Evaluate'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};
 
export default ResumeUploader;
 
 