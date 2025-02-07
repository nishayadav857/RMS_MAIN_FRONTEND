'use client';

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

interface FileUpload {
    files: File;
    progress: number;
    status: string;
}

const JobDescription = () => {
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
                    toast.success("Upload successful!"); // Success notification
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
                    toast.error(`Upload failed: ${error.message}`); // Error notification
                    checkIfUploadingComplete();
                });
        });
    };

    const checkIfUploadingComplete = () => {
        const unfinishedUploads = files.filter((file) => file.status === "Uploading");
        if (!unfinishedUploads.length) setUploading(false);
    };

    const cancelUpload = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.files.name !== fileName));
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        accept: { "application/pdf": [] },
    });

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                background: '#e8eff9',
                minHeight: "calc(100vh - 8vh)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "60vw", // Reduced width
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
                {files.length > 0 && (
                    <div
                        style={{
                            flex: 1,
                            maxHeight: "400px", // Set max height for the uploaded files section
                            overflowY: "auto", // Enable vertical scrolling
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            background: "#f9f9f9",
                        }}
                    >
                        <h3 style={{ textAlign: "center", marginBottom: "10px", color: "black" }}>Uploaded Files</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {files.map((file: FileUpload, index: number) => (
                                <React.Fragment key={index}>
                                    <li style={{ marginBottom: "15px" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <span style={{ flexGrow: 1, color: "black" }}>
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
                                        <div
                                            style={{
                                                overflowY: "scroll",
                                                background: "#e0e0e0",
                                                height: "5px",
                                                width: "100%",
                                                borderRadius: "3px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${file.progress}%`,
                                                    height: "5px",
                                                    background:
                                                        file.status === "Completed"
                                                            ? "green"
                                                            : file.status === "Failed"
                                                                ? "red"
                                                                : "#4a90e2",
                                                    borderRadius: "3px",
                                                    transition: "width 0.5s ease",
                                                }}
                                            ></div>
                                        </div>
                                    </li>
                                    {index < files.length - 1 && <hr style={{ borderColor: "#ccc", margin: "10px 0" }} />}
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
};

export default JobDescription;
