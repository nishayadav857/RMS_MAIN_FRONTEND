"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, CircularProgress, Typography, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Importing the close icon
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import styles from "../../styles/AllResume.module.css"; // Importing styles for consistency

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

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center'},
    { field: 'jdfilename', headerName: 'JD Filename', width: 220, headerAlign: 'center', align: 'center' },
    { field: 'resumefilename', headerName: 'Resume Filename', width: 240, headerAlign: 'center', align: 'center' },
    { field: 'candidateEmail', headerName: 'Candidate Email', width: 220, headerAlign: 'center', align: 'center' },
    { field: 'compatibilityPercentage', headerName: 'Compatibility Percentage', type: 'number', width: 200, headerAlign: 'center', align: 'center' },
];

export default function DataTable() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:8080/api/resume-evaluation");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setResumes(data);
            } catch (error) {
                console.error("Error fetching resumes", error);
                setError("Error fetching resumes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, []);

    const rows = resumes.map((resume, index) => ({
        id: index + 1,
        jdfilename: resume.jdfilename,
        resumefilename: resume.resumefilename,
        candidateEmail: resume.candidateEmail,
        compatibilityPercentage: resume.compatibilityPercentage,
    }));

    const handleRowClick = (resume: Resume) => {
        setSelectedResume(resume);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedResume(null);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="92vh">
            <Paper sx={{ height: 500, width: '95%', overflow: 'hidden', borderRadius: 2, boxShadow: 3, position: 'relative' }}>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h5" align="center" sx={{ marginBottom: 1 }}>
                        Candidate Details
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography color="error">{error}</Typography>
                        </Box>
                    ) : (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10]}
                            onRowClick={(params) => handleRowClick(resumes[params.row.id - 1])}
                            className="cursor-pointer"
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#B0BEC5',
                                    color: 'black',
                                },
                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                    backgroundColor: '#f5f5f5',
                                },
                                '& .MuiDataGrid-row:nth-of-type(even)': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />
                    )}
                </Box>
            </Paper>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>
                    Skills for {selectedResume?.resumefilename}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 0, top:-5}}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedResume && (
                        <div>
                            <Typography variant="h6">Compatibility Percentage</Typography>
                            <div className="relative w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{ width: `${selectedResume.compatibilityPercentage}%` }}
                                ></div>
                                <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-white">
                                    {selectedResume.compatibilityPercentage}%
                                </span>
                            </div>
                            <Typography variant="h6">Must Have Skills</Typography>
                            <ul className={styles.list}>
                                {selectedResume.mustHaveSkills.map((skill, index) => (
                                    <li key={index} className={`flex items-center mb-2`}>
                                        <span className={`w-3 h-3 rounded-full ${skill.presentInResume === "Yes" ? "bg-green-500" : "bg-red-500"} mr-2`}></span>
                                        {skill.skill}
                                    </li>
                                ))}
                            </ul>
                            <Typography variant="h6">Good to Have Skills</Typography>
                            <ul className={styles.list}>
                                {selectedResume.goodToHaveSkills.map((skill, index) => (
                                    <li key={index} className={`flex items-center mb-2`}>
                                        <span className={`w-3 h-3 rounded-full ${skill.presentInResume === "Yes" ? "bg-green-500" : "bg-red-500"} mr-2`}></span>
                                        {skill.skill}
                                    </li>
                                ))}
                            </ul>
                            <Typography variant="h6">Extra Skills</Typography>
                            <ul className={styles.list}>
                                {selectedResume.extraSkills.map((skill, index) => (
                                    <li key={index} className={`flex items-center mb-2`}>
                                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                        {skill.skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
