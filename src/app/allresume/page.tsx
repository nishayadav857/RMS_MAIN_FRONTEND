"use client";

import React, { useEffect, useState } from "react"; // Added React import
import styles from "../../styles/AllResume.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip"; // Importing Shadcn Tooltip components

interface Skill {
    skill: string;
    presentInResume: string;
    comment: string;
}

interface Resume {
    jdfilename: string;
    resumefilename: string;
    candidateEmail: string;
    compatibilityPercentage: number;
    mustHaveSkills: Skill[];
    goodToHaveSkills: Skill[];
    extraSkills: Skill[];
}

const AllResume = () => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/resume-evaluation')
            .then(response => response.json())
            .then(data => {
                console.log("Received --> ", data);
                if (Array.isArray(data)) {
                    setResumes(data); // Set resumes only if data is an array
                } else {
                    console.error("Expected an array but received:", data);
                }
            })
            .catch(error => {
                console.error("Error fetching resumes: ", error);
            });
    }, []);

    const handleRowClick = (resume: Resume) => {
        setSelectedResume(resume);
    };

    return (
        <TooltipProvider>
            <div>
                <h2 className="text-2xl font-bold text-center mb-4">
                    Candidate Details
                </h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>JD Filename</th>
                            <th>Resume Filename</th>
                            <th>Candidate Email</th>
                            <th>Compatibility Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumes.map((resume, index) => (
                            <Dialog key={index} onOpenChange={(open) => { if (!open) setSelectedResume(null); }}>
                                <DialogTrigger asChild>
                                    <tr onClick={() => handleRowClick(resume)} className="cursor-pointer">
                                        <td>
                                            <Avatar>
                                                <AvatarImage src="/images/avatar.jfif" alt="@shadcn" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </td>
                                        <td>{resume.jdfilename}</td>
                                        <td>{resume.resumefilename}</td>
                                        <td>{resume.candidateEmail}</td>
                                        <td>{resume.compatibilityPercentage}</td>
                                    </tr>
                                </DialogTrigger>
                                <DialogContent className="max-h-96 overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Skills for {resume.resumefilename}</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <h4 className="text-lg font-bold">Compatibility Percentage</h4>
                                        <div className="relative w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${resume.compatibilityPercentage}%` }}
                                            ></div>
                                            <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-white">
                                                {resume.compatibilityPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-lg font-bold">Must Have Skills</h4>
                                        <ul className="list-disc pl-5">
                                            {resume.mustHaveSkills.map((skill, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger>
                                                        <li className="flex items-center mb-2">
                                                            <span className={`w-3 h-3 rounded-full ${skill.presentInResume === "Yes" ? "bg-green-500" : "bg-red-500"} mr-2`}></span>
                                                            {skill.skill}
                                                        </li>
                                                    </TooltipTrigger>
                                                    <br></br>
                                                    <TooltipContent>
                                                        {skill.comment}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-lg font-bold">Good to Have Skills</h4>
                                        <ul className="list-disc pl-5">
                                            {resume.goodToHaveSkills.map((skill, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger>
                                                        <li className="flex items-center mb-2">
                                                            <span className={`w-3 h-3 rounded-full ${skill.presentInResume === "Yes" ? "bg-green-500" : "bg-red-500"} mr-2`}></span>
                                                            {skill.skill}
                                                        </li>
                                                    </TooltipTrigger>
                                                    <br></br>
                                                    <TooltipContent>
                                                        {skill.comment}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-lg font-bold">Extra Skills</h4>
                                        <ul className="list-disc pl-5">
                                            {resume.extraSkills.map((skill, index) => (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger>
                                                        <li className="flex items-center mb-2">
                                                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                            {skill.skill}
                                                        </li>
                                                    </TooltipTrigger>
                                                    <br></br>
                                                    <TooltipContent>
                                                        {skill.comment}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </ul>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </tbody>
                </table>
            </div>
        </TooltipProvider>
    );
}

export default AllResume;
