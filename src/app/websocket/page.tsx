"use client";

import React, { useEffect, useState } from "react";
import UserCard from "../../components/ui/userCards";
import Modal from "../../components/ui/modal";

interface Candidate {
  email: string;
  testKey: string;
  score: number;
  testStatus: string;
  jdfilename: string;
  currentStatus: string;
  questionTypePercentages: null | any;
}

interface SkillFiles {
  skill: string;
  files: string[];
  loading: boolean;
}

interface JdGroup {
  jdName: string;
  skills: SkillFiles[];
}

const skills = ["Java", "Springboot", "JavaScript", "Sql"];

const CandidateSelection = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [responseData, setResponseData] = useState<JdGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectedSkill, setSelectedSkill] = useState<string>(skills[0]);
  const [skillLoading, setSkillLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/candidates");
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setError("Failed to load candidates");
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    setSelectAll(selectedCandidates.size === candidates.length && candidates.length > 0);
  }, [selectedCandidates, candidates.length]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedCandidates(checked ? new Set(candidates.map(c => c.email)) : new Set());
  };

  const handleSelectCandidate = (email: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      newSet.has(email) ? newSet.delete(email) : newSet.add(email);
      return newSet;
    });
  };

  
  
      

  const handleSchedule = async () => {
    if (selectedCandidates.size === 0) return;

    setIsLoading(true);
    try {
      const selected = candidates.filter(c => selectedCandidates.has(c.email));
      const jdFiles = Array.from(new Set(selected.map(c => c.jdfilename))).filter(Boolean) as string[];

      const results = await Promise.all(
        jdFiles.map(jdfilename => ({
          jdName: jdfilename,
          skills: skills.map(skill => ({
            skill,
            files: [],
            loading: false
          }))
        }))
      );

      setResponseData(results);
      setError(null);
      
      // Load initial skill data for first JD
      if (results.length > 0) {
        await handleSkillClick(skills[0], results[0].jdName);
      }
    } catch (err) {
      console.error("Schedule error:", err);
      setError(err instanceof Error ? err.message : "Failed to schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillClick = async (skill: string, jdName: string) => {
    setSelectedSkill(skill);
    setSkillLoading(true);
    
    try {
      const response = await fetch(
        `http://localhost:8085/api/quiz/uploaded/by-name/${encodeURIComponent(jdName)}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const files = await response.json();
      
      setResponseData(prev => prev.map(jd => 
        jd.jdName === jdName
          ? {
              ...jd,
              skills: jd.skills.map(s => 
                s.skill === skill ? { ...s, files, loading: false } : s
              )
            }
          : jd
      ));
    } catch (err) {
      console.error("Skill fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setSkillLoading(false);
    }
  };

  const toggleFile = (fileName: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      newSet.has(fileName) ? newSet.delete(fileName) : newSet.add(fileName);
      return newSet;
    });
  };

  const handleSubmitFiles = async () => {
    try {
        const selectedEmails = Array.from(selectedCandidates);
        const testKeys = Array.from(selectedFiles);
      // Create payload array
      const payloads = testKeys.map(testKey => ({
        emails: selectedEmails,
        testKey: testKey
      }));

      const responses = await Promise.all(
        payloads.map(payload =>
          fetch("http://localhost:8085/api/candidates/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
        )
      );

      

    alert("Candidates scheduled successfully!");
    closeModal();
  } catch (err) {
    console.error("Submission error:", err);
    setError(err instanceof Error ? err.message : "Failed to schedule candidates");
  }
};

  const closeModal = () => {
    setResponseData([]);
    setError(null);
    setSelectedFiles(new Set());
    setSelectedSkill(skills[0]);
  };

  return (
    <div className="container mx-auto p-4 relative z-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Candidate Selection</h1>
        
        {selectedCandidates.size > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">Select All</span>
            </div>
            <button
              onClick={handleSchedule}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Scheduling...' : `Schedule (${selectedCandidates.size})`}
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={!!responseData.length || !!error} onClose={closeModal}>
        {error ? (
          <div className="p-4">
            <h3 className="text-red-500 text-lg font-bold mb-2">Error:</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-4">
            {responseData.map((jdGroup, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold mb-4">
                  JD: <span className="select-all font-mono">{jdGroup.jdName}</span>
                </h3>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  {jdGroup.skills.map(({ skill, loading }) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillClick(skill, jdGroup.jdName)}
                      className={`px-4 py-2 rounded transition-colors ${
                        selectedSkill === skill 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      disabled={skillLoading || loading}
                    >
                      {skill}
                      {loading && "..."}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {skillLoading ? (
                    <div className="text-center py-4">Loading files...</div>
                  ) : (
                    jdGroup.skills
                      .find(s => s.skill === selectedSkill)
                      ?.files.map((file, fileIndex) => (
                        <label 
                          key={fileIndex}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded border cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file)}
                            onChange={() => toggleFile(file)}
                            className="w-4 h-4 accent-blue-500"
                          />
                          <span className="select-text text-gray-700">{file}</span>
                        </label>
                      ))
                  )}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={handleSubmitFiles}
                    disabled={selectedFiles.size === 0 || selectedCandidates.size === 0}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {selectedFiles.size > 0 && selectedCandidates.size > 0 ? (
                      `Schedule ${selectedCandidates.size} candidate${selectedCandidates.size > 1 ? 's' : ''} with ${selectedFiles.size} file${selectedFiles.size > 1 ? 's' : ''}`
                    ) : (
                      "Submit Selected Files"
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <div className="max-h-[80vh] overflow-y-auto pr-4">
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <UserCard
              key={candidate.email}
              username={candidate.email}
              posts={candidate.score}
              views={0}
              avatarUrl=""
              testStatus={candidate.testStatus}
              currentStatus={candidate.currentStatus}
              onSelect={() => handleSelectCandidate(candidate.email)}
              isSelected={selectedCandidates.has(candidate.email)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateSelection;