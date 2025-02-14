"use client";
 
import React, { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, CircularProgress, Typography, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import styles from "../../styles/AllResume.module.css";
 
interface Skill {
    skill: string;
    presentInResume: string;
    comment: string;
}
 
interface Resume {
    jdCode: string;
    name: string;
    candidateEmail: string;
    compatiblity: number;
    mustHaveSkills: Skill[];
    goodToHaveSkills: Skill[];
    extraSkills: Skill[];
}
 
export default function DataTable() {
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
 
    const columns: GridColDef[] = [
        {
            field: 'select',
            headerName: '',
            width: 50,
            renderCell: (params) => (
                showCheckboxes && (
                    <Checkbox
                        checked={selectedRows.includes(params.row.id)}
                        onChange={() => handleCheckboxChange(params.row.id)}
                    />
                )
            ),
            renderHeader: () => (
                showCheckboxes && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={rows.length > 0 && selectedRows.length === rows.length}
                            indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                            onChange={handleSelectAll}
                            sx={{
                                padding: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }
                            }}
                        />
                    </div>
                )
            ),
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            sortable: false,
            filterable: false
        },
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center'},
        { field: 'jdCode', headerName: 'JD Code', width: 120, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Candidate Name', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'candidateEmail', headerName: 'Candidate Email', width: 220, headerAlign: 'center', align: 'center' },
        { field: 'compatiblity', headerName: 'Compatibility %', type: 'number', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'overallIndustryExperience', headerName: 'Experience (Years)', type: 'number', width: 220, headerAlign: 'center', align: 'center' }
    ];
 
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
 
    const handleCheckboxChange = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };
 
    const handleSelectAll = () => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map(row => row.id));
        }
    };
 
    const handleDownloadExcel = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/resume-evaluation/excel");
            if (!response.ok) throw new Error("Failed to download file");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume_evaluation.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Download failed:", error);
            setError("Failed to download Excel file");
        }
    };
 
    const handleSendSelected = async () => {
        if (selectedRows.length === 0) return;
       
        setIsSending(true);
        setError(null);
       
        try {
            const emails = selectedRows
                .map(id => resumes[id - 1]?.candidateEmail)
                .filter(email => email !== undefined) as string[];
 
            const response = await fetch("http://localhost:8080/api/hr/publish-selected", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails }),
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit selected candidates');
            }
 
            setSelectedRows([]);
            setShowCheckboxes(false);
        } catch (error) {
            console.error("Submission error:", error);
            setError(error instanceof Error ? error.message : "Failed to submit selected candidates");
        } finally {
            setIsSending(false);
        }
    };
 
    const rows = resumes.map((resume, index) => ({
        id: index + 1,
        jdCode: resume.jdCode,
        name: resume.name,
        candidateEmail: resume.candidateEmail,
        compatiblity: resume.compatiblity,
        overallIndustryExperience: resume.experience?.overallIndustryExperience || 'N/A',
    }));
 
    const handleRowClick = (resume: Resume) => {
        if (!showCheckboxes) {
            setSelectedResume(resume);
            setDialogOpen(true);
        }
    };
 
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedResume(null);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="95vh">
            <Paper sx={{
                height: 580,
                width: '95%',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: 3,
                position: 'relative'
                , overflowY: 'scroll',
                '& .MuiDataGrid-columnHeaderCheckbox': {
                    minWidth: '0 !important',
                    maxWidth: 'none !important'
                }
            }}>
                <Box sx={{ padding: 2, marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownloadExcel}
                            disabled={loading || isSending}
                        >
                            Download Excel
                        </Button>
 
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setShowCheckboxes(!showCheckboxes);
                                if (!showCheckboxes) setSelectedRows([]);
                            }}
                            disabled={loading || isSending}
                        >
                            {showCheckboxes ? 'Cancel Selection' : 'Select Rows'}
                        </Button>
 
                        {selectedRows.length > 0 && (
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ ml: 2 }}
                                onClick={handleSendSelected}
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <>
                                        <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                                        Submitting...
                                    </>
                                ) : (
                                    `Selected (${selectedRows.length})`
                                )}
                            </Button>
                        )}
                    </div>
 
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
 
                    <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
                        Candidate Details
                    </Typography>
 
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
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
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none'
                                }
                            }}
                        />
                    )}
                </Box>
            </Paper>
 
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Skills for {selectedResume?.name}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'relative', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedResume && (
                        <div>
                            <Box mb={3}>
                                <Typography variant="h6" gutterBottom>
                                    Compatibility Percentage
                                </Typography>
                                <Box position="relative" height="24px" borderRadius="12px" bgcolor="grey.200">
                                    <Box
                                        position="absolute"
                                        height="100%"
                                        borderRadius="12px"
                                        bgcolor="primary.main"
                                        width={`${selectedResume.compatiblity}%`}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="body2" color="white">
                                            {selectedResume.compatiblity}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
 
                            <SkillSection
                                title="Must Have Skills"
                                skills={selectedResume.mustHaveSkills}
                            />
                           
                            <SkillSection
                                title="Good to Have Skills"
                                skills={selectedResume.goodToHaveSkills}
                            />
                           
                            <SkillSection
                                title="Extra Skills"
                                skills={selectedResume.extraSkills}
                                isExtra
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
 
function SkillSection({ title, skills, isExtra = false }: {
    title: string;
    skills: Skill[];
    isExtra?: boolean
}) {
    return (
        <Box mb={3}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <ul className={styles.list}>
                {skills.map((skill, index) => (
                    <li key={index} className="flex items-center mb-2">
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                            isExtra ? 'bg-green-500' :
                            skill.presentInResume === "Yes" ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {skill.skill}
                        {/* {skill.comment && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="ml-2">
                                        <span className="text-gray-500">(?)</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{skill.comment}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )} */}
                    </li>
                ))}
            </ul>
        </Box>
    );
}
 