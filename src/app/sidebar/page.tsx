'use client';

import React, { useState } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { BsHouseDoor, BsBarChart, BsGraphUp } from "react-icons/bs";
import NotificationPanel from "../../components/NotificationPanel";

interface SidebarProps {
    handlePageChange: (page: string) => void;
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

export default function Sidebar({ handlePageChange, isMenuOpen, toggleMenu }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={`${collapsed ? "w-20" : "w-64"} min-h-screen transition-all duration-300 bg-white ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} shadow-md relative`}>
            <div className="flex items-center justify-between p-4">
                {!collapsed && (
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="h-10"
                    />
                )}
                <button 
                    onClick={() => { toggleCollapse(); toggleMenu(); }} 
                    className="text-xl"
                >
                    <FiMenu />
                </button>
            </div>

            <input
                type="text"
                placeholder="Search..."
                className={`${collapsed ? "hidden" : "block"} w-full px-4 py-2 mb-4 bg-gray-200 rounded-lg outline-none`}
            />

            <ul className="space-y-2">
                <li>
                    <a
                        href="#"
                        onClick={() => handlePageChange('evaluation')}
                        className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        <BsBarChart />
                        {!collapsed && <span>Evaluate Candidates</span>}
                    </a>
                </li>
                
                <NotificationPanel collapsed={collapsed} />

                <li>
                    <a
                        href="#"
                        onClick={() => handlePageChange('dashboard')}
                        className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        <BsHouseDoor />
                        {!collapsed && <span>Dashboard</span>}
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        onClick={() => handlePageChange('websocket')}
                        className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        <BsBarChart />
                        {!collapsed && <span>Quiz Dashboard</span>}
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        onClick={() => handlePageChange('dataTable')}
                        className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        <BsGraphUp />
                        {!collapsed && <span>Candidate Details</span>}
                    </a>
                </li>
            </ul>

            <div className="mt-20 space-y-4">
                <a
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                    <FiLogOut />
                    {!collapsed && <span>Logout</span>}
                </a>
                <div className="flex items-center gap-4 px-4">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        className="toggle toggle-primary"
                    />
                    {!collapsed && <span>Dark Mode</span>}
                </div>
            </div>
        </div>
    );
}